"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const configSchema = new mongoose_1.default.Schema({
    crab_DepartmentType: { type: String, required: false },
    crab_Prefix: { type: String, default: "-", required: false },
    shift_OnDuty: { type: String, default: null, required: false },
    shift_OnBreak: { type: String, default: null, required: false },
    shift_Logs: { type: String, default: null, required: false },
    shift_Types: { type: [String], default: null, required: false },
    perms_PersonnelRole: { type: String, default: null, required: false },
    perms_SupervisorRole: { type: String, default: null, required: false },
    perms_HiCommRole: { type: String, default: null, required: false },
    perms_AllAccessRole: { type: String, default: null, required: false },
    report_Logs: { type: String, default: null, required: false },
    records_Logs: { type: String, default: null, required: false },
    punish_Logs: { type: String, default: null, required: false },
    promote_Logs: { type: String, default: null, required: false },
    crab_AppealLink: { type: String, default: null, required: false },
    guildId: { type: String, default: null, required: true, unique: true },
});
const crabConfig = mongoose_1.default.model("Configuration", configSchema);
exports.default = crabConfig;
