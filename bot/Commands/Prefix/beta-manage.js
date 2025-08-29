const { EmbedBuilder, inlineCode, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags } = require("discord.js")
const detectIdType = require("../../Functions/detectIdType")
module.exports = {
  command: "beta",
  execute: async (message, client) => {
    const args = message.content.trim().split(/ +/);
    const type = args.slice(1).join(" ").toLowerCase(); // Add or Remove
    const ID = args.slice(2).join(" ").toLowerCase();
    const result = await detectIdType(client, ID)

    if (result.type === "guild") {
      if (type === "add") {
        
      }
      const embed = new EmbedBuilder()
    } else {
      return message.reply("Plese enter a valid **guild** id.")
    }
}
}
