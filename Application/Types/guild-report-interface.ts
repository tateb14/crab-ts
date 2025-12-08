import { Document } from "mongoose";

export interface GuildReportInterface extends Document {
    reportType: string;
    description: string;
    issuedBy: string;
    reviewedBy: string;
    id: string;
    dateIssued: Date;
    messageId: string;
    guildId: string;
    custom_field1: string;
    custom_field2: string;
    custom_field3: string;
    custom_reportId: string;
}
