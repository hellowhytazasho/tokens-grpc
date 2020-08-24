const crypto = require('crypto');

const REFRESH_TOKEN_BYTES = 48;

function generateToken() {
  const token = crypto
    .randomBytes(REFRESH_TOKEN_BYTES)
    .toString('hex');

  return token;
}

module.exports = {
  generateToken,
};
