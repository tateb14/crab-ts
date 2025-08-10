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
    try {
    const GuildConfig = await crabConfig.findOne({ guildId: message.guild.id });
    const CrabPrefix = GuildConfig?.crab_Prefix || "-";

    if (!message.content.startsWith(CrabPrefix)) return;

    const args = message.content.slice(CrabPrefix.length).trim().split(/ +/);
    const commandName = args.shift().toLowerCase();

    const Command = client.prefixCommands.get(commandName);

    if (!Command) return;
    await Command.execute(message, client, args);
    } catch (error) {
      const logChannel = "1404099479908651070";
      const channel = await client.channels.fetch(logChannel);
      const ErrorEmbed = new EmbedBuilder()
        .setTitle("Error Report")
        .setColor(0xe9c46a)
        .setTimestamp()
        .setDescription(
          `An error has occured while running </${interaction.commandName}:${interaction.commandId}>. Please review the information below.`
        )
        .addFields(
          {
            name: "Guild Information",
            value: `${interaction.guild.name} :: ${inlineCode(
              interaction.guild.id
            )}`,
          },
          {
            name: "User Information",
            value: `${interaction.user.username} :: ${inlineCode(
              interaction.user.id
            )}`,
          },
          {
            name: "Error Log",
            value: `${error}`,
          },
          {
            name: "Error Stack",
            value: `${codeBlock(error.stack)}`,
          }
        );
      await channel.send({
        embeds: [ErrorEmbed],
        content: "<@&1404099944457175110>",
      });
      interaction.reply({
        content: "There was an error while trying to execute this command! The issue has been reported to [Tropical Systems](https://discord.gg/8XScx8MNfE).",
        flags: ["Ephemeral"],
      });
      console.log(`[ SYSTEM ][ MESSAGE CMD ERROR ] There was an error while executing an message command!\nError Stack: ${error.stack}`);
    }
  }
};
