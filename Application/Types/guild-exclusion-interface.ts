import { Document } from "mongoose";

export interface GuildExclusionInterface extends Document {
    crab_guildId: string;
    crab_Reason: string;
    crab_Proof: string;
    issuedBy: string;
}
