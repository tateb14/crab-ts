const { Schema, model } = require('mongoose')

const CrabBetaServers = new Schema({
  ownerId: {
    type: String,
    required: false,
  },
  guildId: {
    type: String,
    required: false,
  },
})
const betaServers = model("Beta Servers", CrabBetaServers);

module.exports = betaServers;
