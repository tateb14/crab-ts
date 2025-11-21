import {
  EmbedBuilder,
  Embed,
  Client,
  Guild,
  TextChannel,
  inlineCode,
} from "discord.js";
import * as config from "../../config.json";
import crabConfig from "../Models/crab-config";
import { fetchGuildChannel } from "../Functions/fetch-channel-handler";

export default {
  event: "guildDelete",
  once: false,
  execute: async (client: Client, guild: Guild) => {
    const leaveLogChannelId = config.logging.leaveLogs;
    const channel = await fetchGuildChannel(client, guild, leaveLogChannelId)
     if (!channel) return;

    const leaveEmbed = new EmbedBuilder()
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
          value: `<@${guild.ownerId}> (${inlineCode(guild.ownerId)})`,
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
    await crabConfig.findOneAndDelete({ guildId: guild.id })
    const totalMembers = client.guilds.cache.reduce(
      (acc, guild) => acc + guild.memberCount,
      0
    );
    await channel.send({
      embeds: [leaveEmbed],
      content: `**Crab** has left a guild! Our current guild count is: **${client.guilds.cache.size}** and our member count is: **${totalMembers}**.\n\n## Guild Information`,
    });
  },
};
