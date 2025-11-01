import { Document } from "mongoose";

export interface UserExclusionInterface extends Document {
  crab_userId: string,
  crab_Reason: string,
  crab_Proof: string,
  issuedBy: string
}
