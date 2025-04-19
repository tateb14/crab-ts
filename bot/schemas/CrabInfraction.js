const { Schema, model } = require('mongoose')

const CrabConfig = new Schema({
  infract_staffMember: {
    type: String,
    required: true,
  },
  infract_type: {
    type: String,
    required: true,
  },
  infract_expires: {
    type: String,
    required: true,
  },
  infract_reason: {
    type: String,
    required: true,
  },
  guildId: {
    type: String,
    required: true,
  },
})
const crabConfig = model("Configuration", CrabConfig);

module.exports = crabConfig;
