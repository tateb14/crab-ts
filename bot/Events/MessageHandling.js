const crabConfig = require('../schemas/CrabConfig')
const CrabGuildExclusion = require("../schemas/CrabGuildExclusion")
const CrabUserExclusion = require("../schemas/CrabUserExclusion")
module.exports = {
  event: 'messageCreate',
  once: false,
  execute: async (client, message) => {
    if (message.author.bot || !message.guild) return;
    const UserExcluded = await CrabUserExclusion.findOne({ crab_UserID: message.author.id })
    const GuildExluded = await CrabGuildExclusion.findOne({ crab_guildId: message.guild.id })
    if (GuildExluded) {
      message.reply("<:crab_shield:1349197477198168249> This guild has been excluded from this service, the bot will now leave the guild.")
      const user = await message.guild.fetchOwner()
      user.send("Embed here")
      client.guilds.cache.get(message.guild.id).leave()
      return;
    } else if (UserExcluded) {
      return message.reply("<:crab_shield:1349197477198168249> You have been excluded from this service and cannot run any commands.")
    }

    const GuildConfig = await crabConfig.findOne({ guildId: message.guild.id });
    const CrabPrefix = GuildConfig?.crab_Prefix || "-";

    if (!message.content.startsWith(CrabPrefix)) return;

    const args = message.content.slice(CrabPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const Command = client.prefixCommands.get(commandName);

    if (!Command) return;

    try {
      await Command.execute(message, client, args);
    } catch (error) {
      console.error(`Error executing command: ${error}`);
      message.reply({ content: 'There was an error while trying to execute this command!' });
    }
  }
};
