const ms = require('ms');
const mongoose = require('mongoose');

const { Schema } = mongoose;

const SchemaDefinition = {
  token: {
    type: String,
    require: true,
  },
  tokenData: {
    type: String,
    default: '',
  },
  ttl: {
    type: String,
    require: true,
  },
};

const TokensSchema = new Schema(
  SchemaDefinition,
  { timestamps: { createdAt: 'createdAt' } },
);

TokensSchema.virtual('isValid').get(function isValidGetter() {
  const ttlMS = ms(this.ttl);
  return ((this.createdAt.getTime() + ttlMS) - Date.now()) > 0;
});

TokensSchema.index({ token: 1 }, { unique: true });

const Tokens = mongoose.model('token', TokensSchema);

module.exports = { SchemaDefinition, Tokens };
