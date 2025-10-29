"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const guildRecordSchema = new mongoose_1.default.Schema({
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
const guildRecord = mongoose_1.default.model("Guild-Records", guildRecordSchema);
exports.default = guildRecord;
