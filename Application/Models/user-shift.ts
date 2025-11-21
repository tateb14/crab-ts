import mongoose from "mongoose";
import { UserShiftInterface } from "../Types/user-shift-interface";

const userShiftSchema = new mongoose.Schema<UserShiftInterface>({
  shift_User: { type: String, required: false },
  shift_Type: { type: String, required: false },
  shift_OnDuty: { type: Boolean, required: false },
  shift_OnBreak: { type: Boolean, required: false },
  shift_Total: { type: Number, required: false },
  shift_start: { type: Number, required: false },
  shift_startBreak: { type: Number, required: false },
  shift_endBreak: { type: Number, required: false },
  shift_TotalBreakTime: { type: Number, required: false },
  guildId: { type: String, required: true },
})
const userShift = mongoose.model("User-Shift", userShiftSchema);

export default userShift
