const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags, User, Message } = require("discord.js")
module.exports = {
  customId: "crab-modal_access-code-form",
  execute: async (interaction) => {
    const AccessCode = 'jrAU7m'
    const InputtedAccessCode = interaction.fields.getTextInputValue("crab_access-code-input")

    if (InputtedAccessCode === AccessCode) {
      const embed = new EmbedBuilder()
      .setTitle(`Welcome @${interaction.user.username},`)
      .setDescription("You are now beginning the exclusion process. Please begin by selecting the type of exclusion.\n- User Exclusion\n- Guild Exclusion\n\n-# Please have the information at the ready.");

      const UserExclusion = new ButtonBuilder()
      .setCustomId("crab-exclude_user")
      .setLabel("User Exclusion")
      .setStyle(ButtonStyle.Secondary)
      const GuildExclusion = new ButtonBuilder()
      .setCustomId("crab-exclude_guild")
      .setLabel("Guild Exclusion")
      .setStyle(ButtonStyle.Secondary)

      const row = new ActionRowBuilder().addComponents(UserExclusion, GuildExclusion)
      interaction.reply({ embeds: [embed], components: [row], flags: MessageFlags.Ephemeral })
    }
  }
}
