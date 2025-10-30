import { ChannelType, Client, Guild, TextChannel } from "discord.js";
export async function fetchGuildChannel(client: Client, guild: Guild, channelId: string): Promise<TextChannel | null> {
  let channel = guild.channels.cache.get(channelId)
  if (!channel) {
    const fetchedChannel = await client.channels.fetch(channelId).catch(() => null);
    if (!fetchedChannel || fetchedChannel.type !== ChannelType.GuildText) return null
    channel = fetchedChannel
  }
  if (!channel || channel.type !== ChannelType.GuildText) return null;
  return channel as TextChannel
}
