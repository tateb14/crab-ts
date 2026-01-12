import { MessageFlags, ButtonInteraction } from "discord.js";
export default {
    customId: "crab-button_cancel",
    execute: async (interaction: ButtonInteraction) => {
        await interaction.reply({ content: "Action **canceled**, I have **not** deleted the shift.", flags: MessageFlags.Ephemeral });
    },
};
