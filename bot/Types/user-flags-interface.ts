import { Document } from "mongoose";

export interface UserFlagsInterface extends Document {
  userID: string,
  flags: string[]
}
