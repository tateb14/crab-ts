const { Schema, model } = require('mongoose')

const GuildExclusion = new Schema({
  crab_guildId: {
    type: String,
    required: false,
  },
  crab_Reason: {
    type: String,
    required: false,
  },
  crab_Proof: {
    type: String,
    required: false,
  },
  issuedBy: {
    type: String,
    required: true,
  },
})
const CrabGuildExclusion = model("Guild-Exclusions", GuildExclusion);

module.exports = CrabGuildExclusion;
