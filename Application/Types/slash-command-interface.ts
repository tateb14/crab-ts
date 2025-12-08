import { ChatInputCommandInteraction, Client, SlashCommandBuilder } from "discord.js";

export interface SlashCommand {
    data: SlashCommandBuilder;
    execute: (interaction: any, client: Client) => Promise<void>;
    autocomplete?: (interaction: ChatInputCommandInteraction) => Promise<void>;
}
