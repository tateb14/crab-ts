import { ActionRowBuilder, ButtonInteraction, Client, ModalBuilder, TextInputBuilder, TextInputStyle } from "discord.js";
export default {
    customId: "crab-exclude_access-code",
    execute: async (interaction: ButtonInteraction, client: Client) => {
        const [_, userId] = interaction.customId.split(":");
        if (interaction.user.id === userId) {
            const accessModal = new ModalBuilder().setCustomId("crab-modal_access-code-form").setTitle("Enter Access Code");
            const accessCodeForm = new TextInputBuilder().setCustomId("crab_access-code-input").setLabel("Access Code:").setStyle(TextInputStyle.Short).setRequired(true);
            const row = new ActionRowBuilder<TextInputBuilder>().addComponents(accessCodeForm);
            accessModal.addComponents(row);
            await interaction.showModal(accessModal);
        }
    },
};
