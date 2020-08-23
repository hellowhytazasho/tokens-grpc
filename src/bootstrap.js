const gracefulShutdown = require('./graceful-shutdown');

const db = require('./mongodb');

const bootstrap = async (config) => {
  gracefulShutdown();

  await db.init(config);
};

module.exports = bootstrap;
