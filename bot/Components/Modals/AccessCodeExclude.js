const { EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags, User, Message } = require("discord.js")
require("dotenv").config()
module.exports = {
  customId: "crab-modal_access-code-form",
  execute: async (interaction) => {
    const AccessCode = process.env.ACCESS_CODE
    const InputtedAccessCode = interaction.fields.getTextInputValue("crab_access-code-input")

    if (InputtedAccessCode === AccessCode) {
      const embed = new EmbedBuilder()
      .setTitle(`Welcome @${interaction.user.username},`)
      .setDescription("You are now beginning the exclusion process. Please begin by selecting the type of exclusion.\n- User Exclusion\n- Guild Exclusion\n\n-# Please have the information at the ready.")
      .setImage("https://cdn.discordapp.com/attachments/1265767289924354111/1409647765188907291/CrabBanner-EmbedFooter-RedBG.png?ex=68ae2449&is=68acd2c9&hm=643546e45cccda97a49ab46b06c08471d89efbd76f2043d57d0db22cf5a1f657&")
      
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
