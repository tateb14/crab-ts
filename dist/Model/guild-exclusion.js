"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const guildExclusionSchema = new mongoose_1.default.Schema({
    crab_guildId: { type: String, required: true, unique: true },
    crab_Reason: { type: String, required: true },
    crab_Proof: { type: String, required: true },
    issuedBy: { type: String, required: true },
});
const guildExclusion = mongoose_1.default.model("Guild-Exclusions", guildExclusionSchema);
exports.default = guildExclusion;
