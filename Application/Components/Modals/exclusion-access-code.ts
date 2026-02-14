import { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags, ModalSubmitInteraction } from "discord.js";
import 'dotenv/config';
import { emojis } from '../../config';
export default {
    customId: "crab-modal_access-code-form",
    execute: async (interaction: ModalSubmitInteraction) => {
        const accessCode = process.env.ACCESS_CODE;
        const inputtedAccessCode = interaction.fields.getTextInputValue("crab_access-code-input");

        if (inputtedAccessCode !== accessCode) {
            return interaction.reply({ content: `${emojis.x} **@${interaction.user.username}**, incorrect access code.`, flags: MessageFlags.Ephemeral });
        }
        const embed = new EmbedBuilder().setTitle(`${emojis.icon} Welcome @${interaction.user.username},`).setDescription("You are now beginning the exclusion process. Please begin by selecting the type of exclusion.\n- User Exclusion\n- Guild Exclusion\n\n-# Please have the information at the ready.").setImage("https://cdn.discordapp.com/attachments/1265767289924354111/1409647765188907291/CrabBanner-EmbedFooter-RedBG.png?ex=68ae2449&is=68acd2c9&hm=643546e45cccda97a49ab46b06c08471d89efbd76f2043d57d0db22cf5a1f657&");

        const userExclusion = new ButtonBuilder().setCustomId("crab-exclude_user").setLabel("User Exclusion").setStyle(ButtonStyle.Secondary);
        const guildExclusion = new ButtonBuilder().setCustomId("crab-exclude_guild").setLabel("Guild Exclusion").setStyle(ButtonStyle.Secondary);

        const row = new ActionRowBuilder<ButtonBuilder>().addComponents(userExclusion, guildExclusion);
        interaction.reply({ embeds: [embed], components: [row], flags: MessageFlags.Ephemeral });
    },
};
