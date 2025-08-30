const { EmbedBuilder, inlineCode, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags, Guild } = require("discord.js")
const detectIdType = require("../../Functions/detectIdType")
const CrabBetaServer = require("../../schemas/CrabBetaServers")
module.exports = {
  command: "beta",
  execute: async (message, client) => {
    const AuthorizedRoles = ["1265766750994043022", "1266182977755287613"];
    if (!AuthorizedRoles.some((roleId) => message.member.roles.cache.has(roleId))) {
      return
    }
    const args = message.content.trim().split(/ +/);
    const type = args.slice(1).join(" ").toLowerCase(); // Add or Remove
    const ID = args.slice(2).join(" ").toLowerCase();
    const result = await detectIdType(client, ID)
    if (result.type === "guild") {
      const guild = await client.guilds.fetch(ID)
      const savedGuild = await CrabBetaServer.findOne({ guildId: guild.id })

      if (type.startsWith("add")) {
      if (savedGuild) {
        return message.reply("<:crab_x:1409708189896671357> This server has already been added to the guild list.")
      }
        const newGuild = new CrabBetaServer({
            ownerId: guild.ownerId,
            guildId: guild.id
          })
        const embed = new EmbedBuilder()
        .setColor(0xec3935)
        .setTitle("Beta Server Addition")
        .setImage("https://cdn.discordapp.com/attachments/1265767289924354111/1409647765188907291/CrabBanner-EmbedFooter-RedBG.png?ex=68b41309&is=68b2c189&hm=55eff6c25f8e7a4537c34536c9207f68f36ca42d2c2a61bba83647bde56a7bed&")
        .setFooter({ text: `Requested by ${message.author.id}` })
        .setTimestamp()
        .setDescription("I have added a new guild to the beta list.")
        .addFields(
          {
            name: `Server Owner`,
            value: `<@${guild.ownerId}> (${inlineCode(guild.ownerId)})`
          },
                    {
            name: `Server Name`,
            value: `${guild.name} (${inlineCode(guild.id)})`
          },
        )

        await newGuild.save()
        return message.reply({ embeds: [embed] })
        } else if (type.startsWith("remove")) {
        await CrabBetaServer.findOneAndDelete({ guildId: guild.id })
        const embed = new EmbedBuilder()
        .setColor(0xec3935)
        .setTitle("Beta Server Removal")
        .setDescription("I have removed a guild from the beta list.")
        .setImage("https://cdn.discordapp.com/attachments/1265767289924354111/1409647765188907291/CrabBanner-EmbedFooter-RedBG.png?ex=68b41309&is=68b2c189&hm=55eff6c25f8e7a4537c34536c9207f68f36ca42d2c2a61bba83647bde56a7bed&")
        .setFooter({ text: `Requested by ${message.author.id}` })
        .setTimestamp()
        .addFields(
          {
            name: `Server Owner`,
            value: `<@${guild.ownerId}> (${inlineCode(guild.ownerId)})`
          },
          {
            name: `Server Name`,
            value: `${guild.name} (${inlineCode(guild.id)})`
          },
        )
        return message.reply({ embeds: [embed] })
        } else {
          return message.reply("<:crab_x:1409708189896671357> Plese enter a valid **action** (add/remove).")
        }

    } else {
      return message.reply("<:crab_x:1409708189896671357> Plese enter a valid **guild** id.")
    }
}
}
