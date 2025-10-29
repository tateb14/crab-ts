"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const crabPromotionSchema = new mongoose_1.default.Schema({
    promotion_staffMember: { type: String, required: true },
    promotion_issuedBy: { type: String, required: true },
    promotion_notes: { type: String, required: true },
    promotion_newRoleId: { type: String, required: true },
    promotion_id: { type: String, required: true },
    guildId: { type: String, required: true },
});
const crabPromotion = mongoose_1.default.model("Promotions", crabPromotionSchema);
exports.default = crabPromotion;
