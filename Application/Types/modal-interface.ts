import { ButtonInteraction } from "discord.js";

export interface ModalInterface {
  customId: string;
  execute: (interaction: ButtonInteraction) => Promise<void>;
}
