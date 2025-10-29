"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const shiftLogSchema = new mongoose_1.default.Schema({
    shift_User: { type: String, required: true },
    shift_Type: { type: String, required: false },
    shift_Time: { type: Number, required: false },
    shift_BreakTime: { type: Number, required: false },
    shift_id: { type: String, required: false },
    guildId: { type: String, required: true },
});
const shiftLog = mongoose_1.default.model("Individual-Shift-Logs", shiftLogSchema);
exports.default = shiftLog;
