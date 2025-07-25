const { Schema, model } = require('mongoose')

const CrabPromotion = new Schema({
  promotion_staffMember: {
    type: String,
    required: true,
  },
  promotion_issuedBy: {
    type: String,
    required: true,
  },
  promotion_notes: {
    type: String,
    required: true,
  },
  promotion_newRoleId: {
    type: String,
    required: true,
  },
  promotion_id: {
    type: String,
    required: true,
  },
  guildId: {
    type: String,
    required: true,
  },
})
const crabPromotion = model("Promotions", CrabPromotion);

module.exports = crabPromotion;
