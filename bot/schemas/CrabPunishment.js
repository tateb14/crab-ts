const { Schema, model } = require('mongoose')

const CrabPunishment = new Schema({
  punishment_staffMember: {
    type: String,
    required: true,
  },
  punishment_issuedBy: {
    type: String,
    required: true,
  },
  punishment_notes: {
    type: String,
    required: true,
  },
  punishment_type: {
    type: String,
    required: true,
  },
  punishment_reason: {
    type: String,
    required: true,
  },
  punishment_id: {
    type: String,
    required: true,
  },
  punishment_date: {
    type: Date,
    required: true
  },
  guildId: {
    type: String,
    required: true,
  },
})
const crabPunishment = model("Punishment", CrabPunishment);

module.exports = crabPunishment;
