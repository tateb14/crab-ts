import mongoose from "mongoose";
import { GuildRecordInterface } from "../Types/guild-record-interface";

const guildRecordSchema = new mongoose.Schema<GuildRecordInterface>({
    suspectUsername: { type: String, required: false },
    recordType: { type: String, required: false },
    charges: { type: String, required: false },
    issuedBy: { type: String, required: false },
    suspectFlags: { type: String, required: false },
    reviewedBy: { type: String, required: false },
    id: { type: String, required: false },
    dateIssued: { type: Date, required: false },
    messageId: { type: String, required: false },
    guildId: { type: String, required: true },
});
const guildRecord = mongoose.model("Guild-Records", guildRecordSchema);

export default guildRecord;
