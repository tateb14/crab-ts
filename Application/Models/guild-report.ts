import mongoose from "mongoose";
import { GuildReportInterface } from "../Types/guild-report-interface";

const guildReportSchema = new mongoose.Schema<GuildReportInterface>({
    reportType: { type: String, required: false },
    description: { type: String, required: false },
    issuedBy: { type: String, required: false },
    reviewedBy: { type: String, required: false },
    dateIssued: { type: Date, required: false },
    id: { type: String, required: false },
    messageId: { type: String, required: true },
    guildId: { type: String, required: true },
    custom_field1: { type: String, required: false },
    custom_field2: { type: String, required: false },
    custom_field3: { type: String, required: false },
    custom_reportId: { type: String, requried: false },
});
const guildReport = mongoose.model("Guild-Reports", guildReportSchema);

export default guildReport;
