import { Document } from "mongoose";

export interface ShiftLogInterface extends Document {
    shift_User: string;
    shift_Type: string;
    shift_Time: number;
    shift_BreakTime: number;
    shift_id: string;
    guildId: string;
}
