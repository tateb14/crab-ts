import mongoose from "mongoose";
import { UserExclusionInterface } from "../Types/user-exclusion-interface";

const userExclusionSchema = new mongoose.Schema<UserExclusionInterface>({
    crab_userId: { type: String, required: true, unique: true },
    crab_Reason: { type: String, required: true },
    crab_Proof: { type: String, required: true },
    issuedBy: { type: String, required: true },
});
const userExclusion = mongoose.model("User-Exclusions", userExclusionSchema);

export default userExclusion;
