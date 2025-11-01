import { ButtonInteraction } from "discord.js";

export interface ButtonInterface {
  customId: string;
  execute: (interaction: ButtonInteraction) => Promise<void>;
}
