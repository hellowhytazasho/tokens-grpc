const mongoose = require('mongoose');
const logger = require('../logger')('db');

const getConnectionString = ({ mongodb }) => {
  const {
    uri,
    username,
    password,
    host,
    port,
    database,
  } = mongodb.connection;

  if (uri) {
    return uri;
  }

  return (
    (username && password)
      ? `mongodb://${username}:${password}@${host}:${port}/${database}?authSource=admin`
      : `mongodb://${host}:${port}/${database}`
  );
};

const init = async (config) => {
  const RETRY_MS = 500;

  const connectionString = getConnectionString(config);

  const { connection } = mongoose;

  connection.once('open', () => {
    logger.info('connected');
  });

  connection.on('error', (err) => {
    logger.error(err);
  });

  const connect = async () => {
    try {
      await mongoose.connect(
        connectionString,
        {
          useNewUrlParser: true,
          useUnifiedTopology: true,
          useCreateIndex: true,
        },
      );
    } catch (error) {
      logger.error(error);
      setTimeout(() => connect(), RETRY_MS);
    }
  };

  await connect();
};

module.exports = {
  init,
};
