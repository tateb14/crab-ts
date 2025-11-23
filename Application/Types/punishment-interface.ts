import { Document } from "mongoose";

export interface PunishmentInterface extends Document {
    punishment_staffMember: string;
    punishment_issuedBy: string;
    punishment_notes: string;
    punishment_type: string;
    punishment_reason: string;
    punishment_id: string;
    punishment_date: Date;
    guildId: string;
}
