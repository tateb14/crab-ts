"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const userShiftSchema = new mongoose_1.default.Schema({
    shift_User: { type: String, required: false },
    shift_Type: { type: String, required: false },
    shift_OnDuty: { type: Boolean, required: false },
    shift_OnBreak: { type: Boolean, required: false },
    shift_Total: { type: Number, required: false },
    shift_start: { type: Number, required: false },
    shift_startBreak: { type: Number, required: false },
    shift_endBreak: { type: Number, required: false },
    shift_TotalBreakTime: { type: Number, required: false },
    guildId: { type: String, required: true },
});
const userShift = mongoose_1.default.model("User-Shift", userShiftSchema);
exports.default = userShift;
