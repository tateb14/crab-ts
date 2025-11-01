import mongoose from "mongoose";
import { GuildExclusionInterface } from "../Types/guild-exclusion-interface";

const guildExclusionSchema = new mongoose.Schema<GuildExclusionInterface>({
  crab_guildId: { type: String, required: true, unique: true },
  crab_Reason: { type: String, required: true },
  crab_Proof: { type: String, required: true },
  issuedBy: { type: String, required: true },
})
const guildExclusion = mongoose.model("Guild-Exclusions", guildExclusionSchema);

export default guildExclusion
