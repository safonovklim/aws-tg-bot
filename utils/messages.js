
const constants = require('./constants');

const getGamePlayers = (game) => {
  const strings = [
    `Ход - ${game.isPlayerOneNext ? constants.CROSS : constants.CIRCLE}`,
    '',
    `${constants.CROSS} Письками ${game.active ? 'играет' : 'играл(-а)'} ${game.tgFirstUserName}`,
  ];
  if (game.tgSecondUserName) {
    strings.push(`${constants.CIRCLE} Сиськами - ${game.tgSecondUserName}`);
  }
  return strings.join('\n');
};

const getGameEndMessage = (gameEndCode, game) => {
  if (gameEndCode === -1) {
    return `😥 вы че натворили?? оба проиграли :(\n\nПомянем сиськи и письки ${constants.CIRCLE} ${constants.CROSS}`;
  }

  const username = gameEndCode === 1 ? game.tgFirstUserName : game.tgSecondUserName;
  return `${gameEndCode === 1 ? `${constants.CROSS} Письки` : `${constants.CIRCLE} Сиськи`} победили! Ура!\n\n${username} - красава!`;
};

module.exports = { getGamePlayers, getGameEndMessage };
