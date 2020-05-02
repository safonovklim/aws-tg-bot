
const DEFAULT_SIZE = 3;
const SPLIT_CHAR = '$';
const EMPTY = '📦';
const CROSS = '🍆';
const CIRCLE = '🍑';
const TELEGRAM_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const { DYNAMODB_TABLE } = process.env;

module.exports = {
  SPLIT_CHAR,
  EMPTY,
  CROSS,
  CIRCLE,
  DEFAULT_SIZE,
  TELEGRAM_TOKEN,
  DYNAMODB_TABLE,
};
