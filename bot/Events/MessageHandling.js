const crabConfig = require("../schemas/CrabConfig");
const CrabGuildExclusion = require("../schemas/CrabGuildExclusion");
const CrabUserExclusion = require("../schemas/CrabUserExclusion");
const { EmbedBuilder } = require("discord.js")
module.exports = {
  event: "messageCreate",
  once: false,
  execute: async (client, message) => {
    if (message.author.bot || !message.guild) return;
    const UserExcluded = await CrabUserExclusion.findOne({
      crab_UserID: message.author.id,
    });
    const GuildExluded = await CrabGuildExclusion.findOne({
      crab_guildId: message.guild.id,
    });
    if (GuildExluded) {
      message.reply(
        "<:crab_shield:1349197477198168249> This guild has been excluded from this service, the bot will now leave the guild."
      );
      const ExclusionEmbed = new EmbedBuilder()
        .setColor(0xec3935)
        .setDescription(
          "This message is in regards of the recent exclusion from the service of **Crab**.\n\nTo clarify, an exclusion from our service comes very rarely and is only applied if a server has broken our terms of service or violated a major rule. Exclusions are not appealable, but they can be removed if an Executive Board member choses to.\n\nThe details of your exclusion are confidential and secure to only Crab staff members. If you wish to inquiry about the exclusion, please see our [support](https://discord.gg/8XScx8MNfE)."
        )
        .setFooter({ text: "Crab Legal Affairs Team" })
        .setTitle("Crab Exclusion Notice")
        .setTimestamp();
      const user = await message.guild.fetchOwner();
      try {
      await user.send({ embeds: [ExclusionEmbed] });
      } catch (error) {
        return
      }
      client.guilds.cache.get(message.guild.id).leave();
      return;
    } else if (UserExcluded) {
      return message.reply(
        "<:crab_shield:1349197477198168249> You have been excluded from this service and cannot run any commands."
      );
    }
    try {
      const GuildConfig = await crabConfig.findOne({
        guildId: message.guild.id,
      });
      const CrabPrefix = GuildConfig?.crab_Prefix || "-";

      if (!message.content.startsWith(CrabPrefix)) return;

      const args = message.content.slice(CrabPrefix.length).trim().split(/ +/);
      const commandName = args.shift().toLowerCase();

      const Command = client.prefixCommands.get(commandName);

      if (!Command) return;
      await Command.execute(message, client, args);
    } catch (error) {
      const logChannel = "1398876136938799176";
      const channel = await client.channels.fetch(logChannel);
      const ErrorEmbed = new EmbedBuilder()
        .setTitle("Error Report")
        .setColor(0xec3935)
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
        content: "<@&1404203220695257241>",
      });
      interaction.reply({
        content:
          "There was an error while trying to execute this command! The issue has been reported to [Tropical Systems](https://discord.gg/8XScx8MNfE).",
        flags: ["Ephemeral"],
      });
      console.log(
        `[ SYSTEM ][ MESSAGE CMD ERROR ] There was an error while executing an message command!\nError Stack: ${error.stack}`
      );
    }
  },
};
