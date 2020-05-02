
const chunk = require('lodash.chunk');
const constants = require('./constants');

const getDefaultDecisions = (size = constants.DEFAULT_SIZE) => Array
  .from(Array(size * size))
  .map(() => 0);

const createButtonCallbackData = (...props) => [...props].join(constants.SPLIT_CHAR);

const getTextByDecisionValue = (decisionValue = 0) => {
  if (decisionValue === 1) {
    return constants.CROSS;
  } if (decisionValue === 2) {
    return constants.CIRCLE;
  }
  return constants.EMPTY;
};

const createKeyboard = (gameId, size = constants.DEFAULT_SIZE, decisions) => {
  const d = !decisions ? getDefaultDecisions(size) : decisions;

  const buttons = d.map((value, index) => ({
    text: getTextByDecisionValue(value),
    callback_data: createButtonCallbackData(gameId, index + 1),
  }));

  return chunk(buttons, size);
};

module.exports = {
  getDefaultDecisions,
  getTextByDecisionValue,
  createKeyboard,
};
