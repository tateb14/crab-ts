const { Schema, model } = require('mongoose')

const CrabUserFlags = new Schema({
  userID: {
    type: String,
    required: false,
  },
  shift_Types: {
    type: Array,
    required: false,
  },
})
const userFlags = model("Flags", CrabUserFlags);

module.exports = userFlags;
