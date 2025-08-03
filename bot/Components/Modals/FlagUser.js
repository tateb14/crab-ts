const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags, User, Message, StringSelectMenuBuilder, StringSelectMenuOptionBuilder } = require("discord.js")
module.exports = {
  customId: "crab-modal_user-flag-input",
  execute: async (interaction) => {
    const UserID = interaction.field.getTextInputValue("crab-flag_user-id")
    const embed = new EmbedBuilder()
    .setTitle(`Welcome @${interaction.user.username},`)
    .setDescription(`You are now applying flags to <@${UserID}>. To remove a flag, simply select "Clear User Flags".`);

    const FlagSelect = new StringSelectMenuBuilder()
    .setCustomId("crab-sm_user-flags")
    .setMinValues(1)
    .setPlaceholder("Select flags to be applied.")
    new StringSelectMenuOptionBuilder()
    .setLabel("Staff Impersonation")
    .setDescription("Pretending to be staff/admin; faking authority.")
    .setEmoji("<:crab_alert:1400664519339937974>")
    .setValue("This user has been flagged for impersonating staff.")
  }
}
