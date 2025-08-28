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
        const embed = new EmbedBuilder()
        .setColor(0xec3935)
        .setDescription("hi")
        if (result.type === "user") {
          const userFetch = client.users.cache.fetch(ID)
          message.reply("User")
        } else if (result.type === 'guild') {
          const guildFetch = client.guilds.cache.fetch(ID)
          embed.setAuthor({ name: `${guildFetch.name}` })
          message.reply({ embeds: [embed] });
        } else {
          message.reply("Invalid ID");
        }

      }
    }
  },
};
