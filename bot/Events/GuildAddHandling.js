const { EmbedBuilder, Embed } = require('discord.js')
const crabConfig = require('../schemas/CrabConfig')
const CrabGuildExclusion = require("../schemas/CrabGuildExclusion")
module.exports = {
  event: 'guildCreate',
  once: false,
  execute: async (client, guild) => {
    const channel = await client.channels.fetch('1349900497452011600')
    const GuildExluded = await CrabGuildExclusion.findOne({ crab_guildId: guild.id })
    if (GuildExluded) {
      const user = await guild.fetchOwner()
      const ExclusionEmbed = new EmbedBuilder()
      .setColor(0xF4A261)
      .setDescription("This message is in regards of the recent exclusion from the service of **Crab**.\n\nTo clarify, an exclusion from our service comes very rarely and is only applied if a server has broken our terms of service or violated a major rule. Exclusions are not appealable, but they can be removed if an Executive Board member choses to.\n\nThe details of your exclusion are confidential and secure to only Crab staff members. If you wish to inquiry about the exclusion, please see our [support](https://discord.gg/8XScx8MNfE).")
      .setFooter({ text: "Crab Legal Affairs Team" })
      .setTitle("Crab Exclusion Notice")
      .setTimestamp()
      await user.send({ embeds: [ExclusionEmbed] })
      client.guilds.cache.get(guild.id).leave()
      return;
    }
    if (channel) {
      const LeaveEmbed = new EmbedBuilder()
      .setColor('#fcc85a')
      .setTitle("Guild Information")
      .addFields(
        {
          name: 'Guild Name:',
          value: `${guild.name}`,
          inline: true,
        },
        {
          name: 'Guild Id:',
          value: `${guild.id}`,
          inline: true,
        },
        {
          name: 'Guild Owner:',
          value: `<@${guild.ownerId}>`,
          inline: true,
        },
        {
          name: 'Guild Member Count:',
          value: `${guild.memberCount}`,
          inline: true,
        },
        {
          name: 'Guild Flags:',
          value: `**Partnered Guild?** ${guild.partnered}\n**Verified Guild?** ${guild.verified}\n`,
          inline: true,
        },
      )
      const config = new crabConfig({
        guildId: guild.id,
      })
      await config.save()
      channel.send({ embeds: [LeaveEmbed], content: `**Crab** has left a new guild! Our current guild count is: **${client.guilds.cache.size}** and our member count is: **${client.users.cache.size}**.` })
    }
  }
}
