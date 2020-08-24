const logger = require('../logger')('service');
const { Tokens } = require('../models/tokens.model');

const {
  generateToken,
} = require('../helpers/tokens.helper');

let tokensService;

class TokensService {
  static init(config) {
    tokensService = new TokensService(config);
    return tokensService;
  }

  /**
   * @returns {TokensService}
   */
  static instance() {
    if (!tokensService) {
      throw new Error(`${this.name} not initialized`);
    }
    return tokensService;
  }

  constructor({ token }) {
    this.ttl = token.ttl;
    this.log = logger;
  }

  async issueToken({ tokenData, tokenTTL = this.ttl }) {
    const randomToken = generateToken();
    await Tokens.create({
      token: randomToken,
      tokenData,
      ttl: tokenTTL,
    });
    return { token: randomToken };
  }

  async verifyToken({ token }) {
    const data = await Tokens.findOne({ token });
    this.log.info('verify token', { token });
    if (!data || !data.isValid) {
      return { isValid: false };
    }

    return {
      isValid: true,
      data: data.tokenData,
    };
  }
}

module.exports = TokensService;
