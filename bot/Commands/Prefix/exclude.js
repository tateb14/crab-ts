const { EmbedBuilder, inlineCode, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags } = require("discord.js")
const { lock_pass } = require("../../../emojis.json")
module.exports = {
  command: "exclude",
  execute: async (message, client) => {
    const AuthorizedUsers = ["653787450761543680", "658973112028626957", "1082009818526654464", "1265984568746573846"]
    if (!message.guild.id === "1348623820331679744") {
      return
    } 
    if (AuthorizedUsers.includes(message.author.id)){
    const embed = new EmbedBuilder()
    .setAuthor({ name: `This command is restricted and has two levels of security.` })
    .setDescription("Please click the button below and input the access code provided to you by Chief Executive Officer.")
    .setColor(0xec3935)
    .setImage("https://cdn.discordapp.com/attachments/1265767289924354111/1409647765188907291/CrabBanner-EmbedFooter-RedBG.png?ex=68ae2449&is=68acd2c9&hm=643546e45cccda97a49ab46b06c08471d89efbd76f2043d57d0db22cf5a1f657&")

    const AccessButton = new ButtonBuilder()
    .setCustomId(`crab-exclude_access-code:${message.author.id}`)
    .setEmoji(lock_pass)
    .setLabel("Enter Access Code")
    .setStyle(ButtonStyle.Danger)

    const row = new ActionRowBuilder().addComponents(AccessButton)
    message.reply({ embeds: [embed], components: [row] })
  }
}
}
