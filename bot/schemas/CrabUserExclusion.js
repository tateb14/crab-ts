const { Schema, model } = require('mongoose')

const UserExclusion = new Schema({
  crab_UserID: {
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
const CrabUserExclusion = model("User-Exclusions", UserExclusion);

module.exports = CrabUserExclusion;
