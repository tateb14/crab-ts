import mongoose from "mongoose";
import { ShiftLogInterface } from "../Types/shift-log-interface";

const shiftLogSchema = new mongoose.Schema<ShiftLogInterface>({
  shift_User: { type: String, required: true },
  shift_Type: { type: String, required: false },
  shift_Time: { type: Number, required: false },
  shift_BreakTime: { type: Number, required: false },
  shift_id: { type: String, required: false },
  guildId: { type: String,required: true },
})
const shiftLog = mongoose.model("Individual-Shift-Logs", shiftLogSchema);

export default shiftLog;
