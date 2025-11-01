import { Document } from "mongoose";

export interface UserShiftInterface extends Document {
  shift_User: string,
  shift_Type: string,
  shift_OnDuty: boolean,
  shift_OnBreak: boolean,
  shift_Total: number,
  shift_start: number,
  shift_startBreak: number,
  shift_endBreak: number,
  shift_TotalBreakTime: number,
  guildId: string
}
