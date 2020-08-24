const log = require('./logger')('unhandled-error');

const logError = (err) => {
  log.error(err);
};

const gracefulShutdown = () => {
  process.on('uncaughtException', logError);
  process.on('warning', logError);
  process.on('unhandledRejection', logError);
};

module.exports = gracefulShutdown;
