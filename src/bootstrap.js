const gracefulShutdown = require('./graceful-shutdown');
const unhandledError = require('./unhandled-error');

const db = require('./mongodb');

const TokensService = require('./services/tokens.service');

const GRPCServer = require('./grpc');
const serviceFunction = require('./grpc/service-function');

const bootstrap = async (config) => {
  gracefulShutdown();
  unhandledError();

  await db.init(config);
  const tokensService = TokensService.init(config);
  const grpcServer = GRPCServer.init(config);

  await grpcServer.loadService(config.grpc.services.tokens, {
    issueToken: serviceFunction(tokensService, 'issueToken'),
    verifyToken: serviceFunction(tokensService, 'verifyToken'),
  });
  grpcServer.listen();
};

module.exports = bootstrap;
