const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags, User, Message } = require("discord.js")
module.exports = {
  customId: "crab-modal_access-code-form",
  execute: async (interaction) => {
    const AccessCode = 'jrAU7m'
    const InputtedAccessCode = interaction.fields.getTextInputValue("crab_access-code-input")

    if (InputtedAccessCode === AccessCode) {
      const embed = new EmbedBuilder()
      .setTitle(`Welcome @${interaction.user.username},`)
      .setDescription("You are now beginning the flagging process. Please begin by inputting the user you are flagging.");

      const UserFlag = new ButtonBuilder()
      .setCustomId("crab-flag_user")
      .setLabel("Flag User")
      .setStyle(ButtonStyle.Danger)

      const row = new ActionRowBuilder().addComponents(UserFlag)
      interaction.reply({ embeds: [embed], components: [row], flags: MessageFlags.Ephemeral })
    }
  }
}
