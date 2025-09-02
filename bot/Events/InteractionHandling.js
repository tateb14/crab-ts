const { EmbedBuilder, inlineCode, codeBlock } = require("discord.js");
const CrabGuildExclusion = require("../schemas/CrabGuildExclusion");
const CrabUserExclusion = require("../schemas/CrabUserExclusion");
const { errorLogs } = require("../../config.json")
module.exports = {
  event: "interactionCreate",
  once: false,
  execute: async (client, interaction) => {
    const UserExcluded = await CrabUserExclusion.findOne({
      crab_UserID: interaction.user.id,
    });
    const GuildExluded = await CrabGuildExclusion.findOne({
      crab_guildId: interaction.guild.id,
    });
    if (GuildExluded) {
      interaction.reply(
        "<:crab_shield:1349197477198168249> This guild has been excluded from this service, the bot will now leave the guild."
      );
      const user = await guild.fetchOwner();
      const ExclusionEmbed = new EmbedBuilder()
        .setColor(0xec3935)
        .setDescription(
          "This message is in regards of the recent exclusion from the service of **Crab**.\n\nTo clarify, an exclusion from our service comes very rarely and is only applied if a server has broken our terms of service or violated a major rule. Exclusions are not appealable, but they can be removed if an Executive Board member choses to.\n\nThe details of your exclusion are confidential and secure to only Crab staff members. If you wish to inquiry about the exclusion, please see our [support](https://discord.gg/8XScx8MNfE)."
        )
        .setFooter({ text: "Crab Legal Affairs Team" })
        .setTitle("Crab Exclusion Notice")
        .setTimestamp();
      try {
        await user.send({ embeds: [ExclusionEmbed] });
      } catch (error) {
        return
      }
      client.guilds.cache.get(interaction.guild.id).leave();
      return;
    } else if (UserExcluded) {
      return interaction.reply(
        "<:crab_shield:1349197477198168249> You have been excluded from this service and cannot run any commands."
      );
    }
    try {
      if (interaction.isAutocomplete()) {
          const command = client.slashCommands.get(interaction.commandName);
          if (!command || typeof command.autocomplete !== "function") return;
  
          await command.autocomplete(interaction, client);
      }
      if (interaction.isCommand()) {
          const Command = client.slashCommands.get(interaction.commandName);
          if (!Command) {
            interaction.reply({
              content: "This command could not be found!",
              flags: ["Ephemeral"],
            });
            return;
          }
          await Command.execute(interaction, client);
      } else if (interaction.isButton()) {
          const Button = client.buttons.get(interaction.customId);
          const UserButton = [...client.userButtons.values()].find((b) =>
            interaction.customId.startsWith(b.customIdPrefix)
          );
  
          if (!Button && !UserButton) {
            return interaction.reply({
              content: "This button could not be found!",
              flags: ["Ephemeral"],
            });
          }
  
          if (Button) {
            await Button.execute(interaction, client);
          } else if (UserButton) {
            await UserButton.execute(interaction, client);
          }
      } else if (interaction.isAnySelectMenu()) {
          const SelectMenu =
            client.selectMenus.get(interaction.values[0]) ||
            client.selectMenus.get(interaction.customId);
          const UserSelectMenu = [...client.userSMs.values()].find((sm) =>
            interaction.customId.startsWith(sm.customIdPrefix)
          );
          if (!SelectMenu && !UserSelectMenu) {
            interaction.reply({
              content: "This select menu could not be found!",
              flags: ["Ephemeral"],
            });
            return;
          }
          if (SelectMenu) {
            await SelectMenu.execute(interaction, client);
          } else if (UserSelectMenu) {
            await UserSelectMenu.execute(interaction, client);
          }
      } else if (interaction.isModalSubmit()) {
          const Modal = client.modals.get(interaction.customId);
          const typeModals = [...client.typeModals.values()].find((tm) =>
            interaction.customId.startsWith(tm.customIdPrefix)
          );
          if (!Modal && !typeModals) {
            interaction.reply({
              content: "This select menu could not be found!",
              flags: ["Ephemeral"],
            });
            return;
          }
          if (Modal) {
            await Modal.execute(interaction, client);
          } else if (typeModals) {
            await typeModals.execute(interaction, client);
          }
      } else return;
    } catch (error) {
      const channel = await client.channels.fetch(errorLogs);
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
      interaction.channel.send({
        content: "There was an error while trying to execute this command! The issue has been reported to [Tropical Systems](<https://discord.gg/8XScx8MNfE>).",
        flags: ["Ephemeral"],
      });
      console.log(
        `[ SYSTEM ][ INTERACTION ERROR ] There was an error while executing an interaction!\nError Stack: ${error.stack}`
      );
    }
    
  },
};
