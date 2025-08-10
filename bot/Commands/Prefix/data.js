const {
  EmbedBuilder,
  inlineCode,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  MessageFlags,
} = require("discord.js");
const detectIdType = require("../../Functions/detectIdType");
module.exports = {
  command: "data",
  aliases: ["d"],
  execute: async (message, client) => {
    const AuthorizedRoles = ["1350154554175520889", "1397681938629787773"];
    if (message.guild.id === "1348623820331679744") {
      if (AuthorizedRoles.some((roleId) => message.member.roles.cache.has(roleId))) {
        const args = message.content.trim().split(/ +/);
        const ID = args.slice(1).join(" ").toLowerCase();
        const result = await detectIdType(client, ID)
        if (result.type === "user") {
          message.reply("User")
        } else if (result.type === 'guild') {
          message.reply(`It's a guild: ${result.object.name}`);
        } else {
          message.reply("Invalid ID");
        }
        const embed = new EmbedBuilder()
        .setColor(0xE9C46A)
      }
    }
  },
};
