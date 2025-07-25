const { Schema, model } = require('mongoose')

const GuildRecord = new Schema({
  suspectUsername: {
    type: String,
    required: false
  },
  recordType: {
    type: String,
    required: false
  },
  charges: {
    type: String,
    required: false
  },
  issuedBy: {
    type: String,
    required: false
  },
  suspectFlags: {
    type: String,
    required: false
  },
  reviewedBy: {
    type: String,
    required: false
  },
  id: {
    type: String,
    required: false
  },
  dateIssued: {
    type: String,
    required: false
  },
  messageId: {
    type: String,
    required: false
  },
  guildId: {
    type: String,
    required: true,
  },
})
const guildRecord = model("Law_Records", GuildRecord);

module.exports = guildRecord;
