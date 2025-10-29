"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const guildReportSchema = new mongoose_1.default.Schema({
    reportType: { type: String, required: false },
    description: { type: String, required: false },
    issuedBy: { type: String, required: false },
    reviewedBy: { type: String, required: false },
    dateIssued: { type: Date, required: false },
    id: { type: String, required: false },
    messageId: { type: String, required: true },
    guildId: { type: String, required: true },
});
const guildReport = mongoose_1.default.model("Guild-Reports", guildReportSchema);
exports.default = guildReport;
