const { Schema, model } = require('mongoose')

const shiftLog = new Schema({
  shift_User: {
    type: String,
    required: false,
  },
  shift_Type: {
    type: String,
    required: false,
  },
  shift_Time: {
    type: String,
    required: false,
  },
  shift_BreakTime: {
    type: String,
    required: false,
  },
  shift_id: {
    type: String,
    required: false,
  },
  guildId: {
    type: String,
    required: true,
  },
})
const ShiftLog = model("shifts_Logs", shiftLog);

module.exports = ShiftLog;
