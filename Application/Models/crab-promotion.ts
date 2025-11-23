import mongoose from "mongoose";
import { PromotionInterface } from "../Types/promotion-interface";

const crabPromotionSchema = new mongoose.Schema<PromotionInterface>({
    promotion_staffMember: { type: String, required: true },
    promotion_issuedBy: { type: String, required: true },
    promotion_notes: { type: String, required: true },
    promotion_newRoleId: { type: String, required: true },
    promotion_id: { type: String, required: true },
    guildId: { type: String, required: true },
});
const crabPromotion = mongoose.model("Promotions", crabPromotionSchema);

export default crabPromotion;
