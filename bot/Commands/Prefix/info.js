const { EmbedBuilder, inlineCode } = require("discord.js")
module.exports = {
  command: "info",
  aliases: ["i", "information"],
  execute: async (message, client) => {
    const embed = new EmbedBuilder()
    .setTitle("Crab Information")
    .setDescription(`Crab is a versatile, one of a kind department management bot. Forget any other bot, Crab's sole purpose is to manage your department, with ease! We have each essential department type: **Law Enforcement, Fire and Medical, and Department of Transportation** for your leisure.`)
    .setFooter({ text: `Guild Count: ${client.guilds.cache.size} | Member Count: ${client.users.cache.size}` })
    .setColor("#b81e37")
    .addFields(
      {
        name: "Crab Information",
        value: `- Database: **MongoDB**\n- [Status Page](https://discord.gg)`
      },
    )
    message.reply({ embeds: [embed] })
  }
}
