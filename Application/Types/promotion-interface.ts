import { Document } from "mongoose";

export interface PromotionInterface extends Document {
    promotion_staffMember: string;
    promotion_issuedBy: string;
    promotion_notes: string;
    promotion_newRoleId: string;
    promotion_id: string;
    guildId: string;
}
