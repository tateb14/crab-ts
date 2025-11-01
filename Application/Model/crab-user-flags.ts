import mongoose from "mongoose";
import { UserFlagsInterface } from "../Types/user-flags-interface";

const crabUserFlagsSchema = new mongoose.Schema<UserFlagsInterface>({
  userID: { type: String, required: false },
  flags: { type: [String], required: false },
})
const crabUserFlags = mongoose.model("User-Flags", crabUserFlagsSchema);

export default crabUserFlags
