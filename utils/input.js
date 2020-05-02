
const constants = require('./constants');

const isGameStartRequested = (message) => {
  const { text } = message;

  return (text || '').startsWith('/game');
};

const getGameSize = (message) => {
  const textSplit = message.text.split(' ');
  if (!textSplit[1]) {
    return constants.DEFAULT_SIZE;
  }
  return Number.parseInt(textSplit[1], 10);
};

const isGameSizeValid = (size = constants.DEFAULT_SIZE) => (size >= 3 && size <= 5);

module.exports = {
  isGameStartRequested,
  getGameSize,
  isGameSizeValid,
};
