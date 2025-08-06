const { EmbedBuilder, inlineCode, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags } = require("discord.js")
module.exports = {
  command: "exclude",
  execute: async (message, client) => {
    console.log(message)
    const AuthorizedUsers = ["653787450761543680", "658973112028626957", "1082009818526654464", "1265984568746573846"]
    if (message.guild.id === "1348623820331679744") {
    if (AuthorizedUsers.includes(message.author.id)){
    const embed = new EmbedBuilder()
    .setAuthor({ name: `This command is restricted and has two levels of security.` })
    .setDescription("Please click the button below and input the access code provided to you by Chief Executive Officer.")
    .setColor(0xffffff)

    const AccessButton = new ButtonBuilder()
    .setCustomId(`crab-exclude_access-code:${message.author.id}`)
    .setEmoji("<:crab_lock_pass:1349197473339670559>")
    .setLabel("Enter Access Code")
    .setStyle(ButtonStyle.Danger)

    const row = new ActionRowBuilder().addComponents(AccessButton)
    message.reply({ embeds: [embed], components: [row] })
  }}
}
}
