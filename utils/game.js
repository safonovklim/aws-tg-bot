
const uuid = require('uuid');
const dynamodb = require('./dynamodb');
const constants = require('./constants');
const keyboardUtils = require('./keyboard');

const TableName = constants.DYNAMODB_TABLE;

const getCombinationByIndexes = (decisions, indexes) => indexes.map((i) => decisions[i]);
const isWinCombination = (combination) => combination[0] !== 0
  && combination.every((value, index, arr) => value === arr[0]);

const findGameEndCode = (game) => {
  let endCode = null;
  const d = game.decisions;

  for (let i = 0; i < game.size; i += 1) {
    const verticalIndexes = Array
      .from(Array(game.size))
      .map((fakeItem, index) => i + index * game.size);
    const verticalValues = getCombinationByIndexes(d, verticalIndexes);

    if (isWinCombination(verticalValues)) {
      endCode = verticalValues[0];
      break;
    }

    const horizontalIndexes = Array
      .from(Array(game.size))
      .map((item, index) => i * game.size + index);
    const horizontalValues = getCombinationByIndexes(d, horizontalIndexes);
    if (isWinCombination(horizontalValues)) {
      endCode = horizontalValues[0];
      break;
    }
  }

  if (!endCode) {
    const firstDiagonalIndexes = Array
      .from(Array(game.size))
      .map((item, index) => (index * game.size) + index);
    const firstDiagonalValues = getCombinationByIndexes(d, firstDiagonalIndexes);
    if (isWinCombination(firstDiagonalValues)) {
      endCode = firstDiagonalValues[0];
    }
  }

  if (!endCode) {
    const secondDiagonalIndexes = Array
      .from(Array(game.size))
      .map((item, index) => (game.size * (index + 1)) - index - 1);
    const secondDiagonalValues = getCombinationByIndexes(d, secondDiagonalIndexes);
    if (isWinCombination(secondDiagonalValues)) {
      endCode = secondDiagonalValues[0];
    }
  }

  if (!endCode) {
    // check for draw
    const draw = d.every((value) => value !== 0);

    if (draw) {
      return -1;
    }
  }

  return endCode;
};

const updateGame = async (gameId, payload = {}) => {
  const payloadKeys = Object.keys(payload);

  if (!payloadKeys.length) {
    return null;
  }

  const ExpressionAttributeNames = {};
  const ExpressionAttributeValues = {};

  payloadKeys.forEach((key) => {
    ExpressionAttributeNames[`#${key}`] = key;
    ExpressionAttributeValues[`:${key}`] = payload[key];
  });

  const updatePayload = {
    TableName,
    Key: {
      id: gameId,
    },
    ExpressionAttributeNames,
    ExpressionAttributeValues,
    UpdateExpression: `SET ${payloadKeys.map((key) => `#${key} = :${key}`).join(', ')}`,
    ReturnValues: 'ALL_NEW',
  };

  const updatedRow = await dynamodb.update(updatePayload).promise();
  return updatedRow.Attributes;
};

const getGame = async (gameId) => {
  const tableRow = await dynamodb.get({
    TableName,
    Key: {
      id: gameId,
    },
  }).promise();

  if (!tableRow || !tableRow.Item) {
    return null;
  }

  return tableRow.Item;
};

const createGame = async (
  chatId,
  messageId,
  firstUserId,
  firstUserName,
  size = constants.DEFAULT_SIZE,
) => {
  const timestamp = new Date().getTime();

  const params = {
    TableName,
    Item: {
      id: uuid.v4(),
      size,
      isPlayerOneNext: true,
      active: true,
      gameEndCode: null, // -1 = draw; 1 = firstUser; 2 = secondUser
      tgFirstUserId: firstUserId,
      tgFirstUserName: firstUserName,
      tgSecondUserId: null,
      tgSecondUserName: null,
      tgChatId: chatId,
      tgMessageId: messageId,
      decisions: keyboardUtils.getDefaultDecisions(size),
      createdAt: timestamp,
    },
  };

  await dynamodb.put(params).promise();

  return params.Item;
};


module.exports = {
  findGameEndCode,
  getGame,
  createGame,
  updateGame,
};
