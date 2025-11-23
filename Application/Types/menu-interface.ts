import { AnySelectMenuInteraction } from "discord.js";

export interface SelectMenuInterface {
    customId: string;
    execute: (interaction: AnySelectMenuInteraction) => Promise<void>;
}
