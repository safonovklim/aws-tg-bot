
const axios = require('axios');
const constants = require('./utils/constants');
const keyboard = require('./utils/keyboard');
const gamesUtil = require('./utils/game');
const messages = require('./utils/messages');
const inputUtils = require('./utils/input');

const BASE_URL = `https://api.telegram.org/bot${constants.TELEGRAM_TOKEN}`;

const isGameStartRequested = (message) => {
  const { text } = message;

  return (text || '').startsWith('/game');
};

const setDecision = async (callbackQuery) => {
  const [gameId, positionStr] = callbackQuery.data.split(constants.SPLIT_CHAR);

  let game = await gamesUtil.getGame(gameId);
  if (!game) {
    return;
  }

  const {
    decisions, tgMessageId, tgChatId, tgFirstUserId, tgSecondUserId, isPlayerOneNext,
  } = game;
  const senderId = callbackQuery.from.id;

  let decisionAllowed = false;
  if (game.active) {
    if (isPlayerOneNext && senderId === tgFirstUserId) {
      decisionAllowed = true;
    } else if (!isPlayerOneNext
      && senderId !== tgFirstUserId
      && (!tgSecondUserId || senderId === tgSecondUserId)
    ) {
      decisionAllowed = true;
    }
  }

  if (!decisionAllowed) {
    await axios.post(`${BASE_URL}/answerCallbackQuery`, { callback_query_id: callbackQuery.id, text: 'Куда ты лезешь?' });
    return;
  }

  const position = Number.parseInt(positionStr, 10);
  if (decisions[position - 1] !== 0) {
    // error
    await axios.post(`${BASE_URL}/answerCallbackQuery`, { callback_query_id: callbackQuery.id, text: 'Ты че тупой? Сюда уже сходили' });
    return;
  }

  const decisionCode = isPlayerOneNext ? 1 : 2;

  const newDecisions = [...decisions];
  newDecisions[position - 1] = decisionCode;

  const updateGamePayload = {
    decisions: newDecisions,
    isPlayerOneNext: !isPlayerOneNext,
  };
  if (!isPlayerOneNext && !tgSecondUserId) {
    updateGamePayload.tgSecondUserId = senderId;
    updateGamePayload.tgSecondUserName = callbackQuery.from.first_name;
  }
  game = await gamesUtil.updateGame(gameId, updateGamePayload);

  const newKeyboard = keyboard.createKeyboard(gameId, game.size, newDecisions);
  await axios.post(`${BASE_URL}/answerCallbackQuery`, {
    callback_query_id: callbackQuery.id,
    text: `${keyboard.getTextByDecisionValue(decisionCode)} заебумба!`,
  });

  const gameMessageNewData = {
    chat_id: tgChatId,
    message_id: tgMessageId,
  };

  const gameEndCode = gamesUtil.findGameEndCode(game);
  if (gameEndCode) {
    gameMessageNewData.text = messages.getGameEndMessage(gameEndCode, game);
    await gamesUtil.updateGame(gameId, { gameEndCode, active: false });
  } else {
    gameMessageNewData.text = messages.getGamePlayers(game);
    gameMessageNewData.reply_markup = JSON.stringify({
      inline_keyboard: newKeyboard,
    });
  }

  await axios.post(`${BASE_URL}/editMessageText`, gameMessageNewData);
};

module.exports.webhook = async (event) => {
  const body = JSON.parse(event.body);

  if (body.callback_query) {
    await setDecision(body.callback_query);
  } else if (body.message && isGameStartRequested(body.message)) {
    const { message } = body;
    const chatId = message.chat.id;
    const requestedSize = inputUtils.getGameSize(message);

    if (!inputUtils.isGameSizeValid(requestedSize)) {
      await axios.post(`${BASE_URL}/sendMessage`, {
        chat_id: chatId,
        text: 'И как мы играть будем?',
      });
    } else {
      const game = await gamesUtil.createGame(
        chatId,
        message.message_id,
        message.from.id,
        message.from.first_name,
        requestedSize,
      );
      const response = await axios.post(`${BASE_URL}/sendMessage`, {
        chat_id: chatId,
        text: `Как крестики-нолики, только...\n\n${constants.CROSS} Письками играет ${game.tgFirstUserName}`,
        reply_markup: JSON.stringify({
          inline_keyboard: keyboard.createKeyboard(game.id, requestedSize),
        }),
      });
      // tgMessageId
      await gamesUtil.updateGame(game.id, { tgMessageId: response.data.result.message_id });
    }
  }

  return {
    statusCode: 200,
    body: JSON.stringify({
      input: event,
    }),
  };
};
