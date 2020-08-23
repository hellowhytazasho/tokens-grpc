const log = require('./logger')('graceful-shutdown');

const shutdownFunction = async () => {
  log.trace('Attempting graceful shutdown');
  try {
    await Promise.all([
      // Services for shutdown
    ]);
  } catch (error) {
    log.error(error);
  }
  process.exit(0);
};

const gracefulShutdown = () => {
  process.on('SIGTERM', shutdownFunction);
  process.on('SIGINT', shutdownFunction);
};

module.exports = gracefulShutdown;
