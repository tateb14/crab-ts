const { Schema, model } = require('mongoose')

const userShift = new Schema({
  shift_User: {
    type: String,
    required: false,
  },
  shift_Type: {
    type: String,
    required: false,
  },
  shift_Status: {
    type: String,
    required: false,
  },
  shift_Total: {
    type: String,
    required: false,
  },
  shift_start: {
    type: String,
    required: false,
  },
  shift_startBreak: {
    type: String,
    required: false,
  },
  shift_endBreak: {
    type: String,
    required: false,
  },
  shift_TotalBreakTime: {
    type: String,
    required: false,
  },
  guildId: {
    type: String,
    required: true,
  },
})
const UserShift = model("shifts_Users", userShift);

module.exports = UserShift;
