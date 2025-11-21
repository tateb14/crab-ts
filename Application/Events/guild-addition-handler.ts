import { EmbedBuilder, Client, Guild } from "discord.js";
import * as config from "../../config.json"
import { guildExclusionCheck } from "../Functions/exclusion-handler";
import { fetchGuildChannel } from "../Functions/fetch-channel-handler";
import crabConfig from "../Models/crab-config";
module.exports = {
  event: "guildCreate",
  once: false,
  execute: async (client: Client, guild: Guild) => {
    const joinLogChannelId = config.logging.joinLogs
    const channel = await fetchGuildChannel(client, guild, joinLogChannelId)
    if (!channel) return;
    await guildExclusionCheck(client, guild);
    const joinEmbed = new EmbedBuilder()
      .setColor(0xec3935)
      .setTitle("Guild Information")
      .addFields(
        {
          name: "Guild Name:",
          value: `${guild.name}`,
          inline: true,
        },
        {
          name: "Guild Id:",
          value: `${guild.id}`,
          inline: true,
        },
        {
          name: "Guild Owner:",
          value: `<@${guild.ownerId}>`,
          inline: true,
        },
        {
          name: "Guild Member Count:",
          value: `${guild.memberCount}`,
          inline: true,
        },
        {
          name: "Guild Flags:",
          value: `**Partnered Guild?** ${guild.partnered}\n**Verified Guild?** ${guild.verified}\n`,
          inline: true,
        }
      );
    const guildConfig = new crabConfig({
      guildId: guild.id,
    })
    await guildConfig.save()
    const totalMembers = client.guilds.cache.reduce(
      (acc, guild) => acc + guild.memberCount,
      0
    );
    await channel.send({
      embeds: [joinEmbed],
      content: `**Crab** has joined a new guild! Our new guild count is: **${client.guilds.cache.size}** and our member count is: **${totalMembers}**.`,
    });
  },
};
