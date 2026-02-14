import { EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, MessageFlags, ButtonInteraction } from "discord.js";
import { emojis } from '../../config';
import safeEdit from "../../Functions/safe-edit";

module.exports = {
    customId: "crab_button-cancel_delete",
    execute: async (interaction: ButtonInteraction) => {
        const [_, messageId, authorizedUser] = interaction.customId.split(":");
        let message = null;

        try {
            if (messageId && interaction.channel) {
                message = await interaction.channel.messages.fetch(messageId);
            }
        } catch (error: any) {
            if (error.code !== 10008) console.error("[Fetch Error]", error);
        }

        await safeEdit(interaction, message, {
            content: `${emojis.search} **Processing** your request...`,
            components: [],
        });

        if (authorizedUser !== interaction.user.id) {
            return safeEdit(interaction, message, {
                content: `${emojis.x} **Access denied**, only the executor of this command can interact with this button.`,
                components: [],
            });
        }

        return safeEdit(interaction, message, {
            content: `${emojis.check} Action canceled, I did not void any logs.`,
            components: [],
        });
    },
};
