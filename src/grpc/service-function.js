const serviceFunction = (service, fn) => {
  if (!service[fn]) {
    throw new Error(`Invalid service function: ${service.constructor.name}.${fn}`);
  }

  return async (call, callback) => {
    try {
      const res = await service[fn](call.request);
      callback(null, res);
    } catch (error) {
      callback(error);
    }
  };
};

module.exports = serviceFunction;
