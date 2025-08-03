const { Schema, model } = require('mongoose')

const CrabUserFlags = new Schema({
  userID: {
    type: String,
    required: false,
  },
  flags: {
    type: Array,
    required: false,
  },
})
const userFlags = model("Flags", CrabUserFlags);

module.exports = userFlags;
