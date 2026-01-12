import { MessageFlags, ButtonInteraction } from "discord.js";
import chalk from "chalk";

export default {
    customId: "crab-button-cancel",
    execute: async (interaction: ButtonInteraction) => {
        interaction.update({ content: "Action canceled, the shift has not been deleted.", components: [] });
        setTimeout(async () => {
            try {
                await interaction.deleteReply();
            } catch (error) {
                console.error(chalk.red.bold("[TS-INTERACTION-ERR] ") + "🪸 Failed to delete interaction reply.", { error });
            }
        }, 10000);
    },
};
