const path = require('path');
const protoLoader = require('@grpc/proto-loader');
const grpc = require('@grpc/grpc-js');

const logger = require('../logger');

let grpcServer;

class GRPCServer {
  static init(config) {
    grpcServer = new GRPCServer(config);
    return grpcServer;
  }

  /**
   * @returns {GRPCServer}
   */
  static instance() {
    if (!grpcServer) {
      throw new Error(`${this.name} not initialized`);
    }
    return grpcServer;
  }

  constructor({ grpc: grpcConfig }) {
    this.grpcConfig = grpcConfig;
    this.services = [];
    this.protosPath = path.join(
      process.cwd(), // TODO: get path from config
      grpcConfig.protoPath,
    );
    this.options = {
      keepCase: true,
      longs: String,
      enums: String,
      defaults: true,
      oneofs: true,
    };
    this.log = logger('grpc');
  }

  async loadServices(services = []) {
    await Promise.all(services.map(this.loadService.bind(this)));
  }

  async loadService({ name, proto }, implementation) {
    const protoPath = path.join(this.protosPath, proto);
    const protoPackage = await protoLoader.load(
      protoPath,
      this.options,
    );
    const protoDefinition = grpc.loadPackageDefinition(protoPackage);
    this.services.push({
      service: protoDefinition[name].service,
      implementation,
    });
  }

  async listen() {
    const server = new grpc.Server();

    this.services.forEach(
      ({ service, implementation }) => server
        .addService(service, implementation),
    );

    const { host, port } = this.grpcConfig.connection;
    await new Promise(
      (res, rej) => server.bindAsync(
        `${host}:${port}`,
        grpc.ServerCredentials.createInsecure(),
        (err) => (err ? rej(err) : res()),
      ),
    );
    server.start();
    this.log.info(`started on ${host}:${port}`);
  }
}

module.exports = GRPCServer;
