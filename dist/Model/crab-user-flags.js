"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const crabUserFlagsSchema = new mongoose_1.default.Schema({
    userID: { type: String, required: false },
    flags: { type: [String], required: false },
});
const crabUserFlags = mongoose_1.default.model("User-Flags", crabUserFlagsSchema);
exports.default = crabUserFlags;
