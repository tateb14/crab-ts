import { Document } from "mongoose";

export interface GuildReportInterface extends Document {
  reportType: string,
  description: string,
  issuedBy: string,
  reviewedBy: string,
  id: string,
  dateIssued: Date,
  messageId: string,
  guildId: string,
}
