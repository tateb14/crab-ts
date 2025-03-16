const { EmbedBuilder, Embed } = require('discord.js')
const crabConfig = require('../schemas/CrabConfig')

module.exports = {
  event: 'guildDelete',
  once: false,
  execute: async (client, guild) => {
    const channel = await client.channels.fetch('1349900497452011600')
    if (channel) {
      const JoinEmbed = new EmbedBuilder()
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
      await crabConfig.findOneAndDelete({ guildId: guild.id })
      channel.send({ embeds: [JoinEmbed], content: `**Crab** has joined a new guild! Our current guild count is: **${client.guilds.cache.size}** and our member count is: **${client.users.cache.size}**.\n\n## Guild Information` })
    }
  }
}
