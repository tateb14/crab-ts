import { Document } from "mongoose";

export interface GuildRecordInterface extends Document {
  suspectUsername: string,
  recordType: string,
  charges: string,
  issuedBy: string,
  suspectFlags: string,
  reviewedBy: string,
  id: string,
  dateIssued: Date,
  messageId: string,
  guildId: string
}
