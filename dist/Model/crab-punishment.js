"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const crabPunishmentSchema = new mongoose_1.default.Schema({
    punishment_staffMember: { type: String, required: true },
    punishment_issuedBy: { type: String, required: true },
    punishment_notes: { type: String, required: true },
    punishment_type: { type: String, required: true },
    punishment_reason: { type: String, required: true },
    punishment_id: { type: String, required: true },
    punishment_date: { type: Date, required: true },
    guildId: { type: String, required: true },
});
const crabPunishment = mongoose_1.default.model("Punishment", crabPunishmentSchema);
exports.default = crabPunishment;
