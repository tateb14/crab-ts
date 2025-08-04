const CrabGuildExclusion = require("../schemas/CrabGuildExclusion")
const CrabUserExclusion = require("../schemas/CrabUserExclusion")
module.exports = {
  event: 'interactionCreate',
  once: false,
  execute: async (client, interaction) => {
    const UserExcluded = await CrabUserExclusion.findOne({ crab_UserID: interaction.user.id })
    const GuildExluded = await CrabGuildExclusion.findOne({ crab_guildId: interaction.guild.id })
    if (GuildExluded) {
      interaction.reply("<:crab_shield:1349197477198168249> This guild has been excluded from this service, the bot will now leave the guild.")
      const user = await guild.fetchOwner()
      const ExclusionEmbed = new EmbedBuilder()
      .setColor(0xF4A261)
      .setDescription("This message is in regards of the recent exclusion from the service of **Crab**.\n\nTo clarify, an exclusion from our service comes very rarely and is only applied if a server has broken our terms of service or violated a major rule. Exclusions are not appealable, but they can be removed if an Executive Board member choses to.\n\nThe details of your exclusion are confidential and secure to only Crab staff members. If you wish to inquiry about the exclusion, please see our [support](https://discord.gg/8XScx8MNfE).")
      .setFooter({ text: "Crab Legal Affairs Team" })
      .setTitle("Crab Exclusion Notice")
      .setTimestamp()
      await user.send({ embeds: [ExclusionEmbed] })
      client.guilds.cache.get(interaction.guild.id).leave()
      return;
    } else if (UserExcluded) {
      return interaction.reply("<:crab_shield:1349197477198168249> You have been excluded from this service and cannot run any commands.")
    }
      if (interaction.isCommand()) {
          try {
              const Command = client.slashCommands.get(interaction.commandName);
              if (!Command) {
                  interaction.reply({ content: 'This command could not be found!', flags: ['Ephemeral'] });
                  return;
              };
              Command.execute(interaction, client);
          } catch (error) {
              interaction.reply({ content: 'There was an error while trying to execute this interaction!', flags: ['Ephemeral'] });
              console.log(`There was an error while executing a slash command interaction!\nError: ${error}`);
          };
      } else if (interaction.isButton()) {
        try {
          const Button = client.buttons.get(interaction.customId);
          const UserButton = [...client.userButtons.values()].find(b => interaction.customId.startsWith(b.customIdPrefix));

          if (!Button && !UserButton) {
              return interaction.reply({ content: 'This button could not be found!', flags: ['Ephemeral'] });
          }

          if (Button) {
              Button.execute(interaction, client);
          } else if (UserButton) {
              UserButton.execute(interaction, client);
          }

      } catch (error) {
          console.error(`Error executing a button interaction!\nError: ${error}`);
          interaction.reply({ content: 'There was an error while trying to execute this interaction!', flags: ['Ephemeral'] });
      }
      } else if (interaction.isAnySelectMenu()) {
          try {
              const SelectMenu = client.selectMenus.get(interaction.values[0]) || client.selectMenus.get(interaction.customId);
              if (!SelectMenu) {
                  interaction.reply({ content: 'This select menu could not be found!', flags: ['Ephemeral'] });
                  return;
              };
              SelectMenu.execute(interaction, client);
          } catch (error) {
              interaction.reply({ content: 'There was an error while trying to execute this interaction!', flags: ['Ephemeral'] });
              console.log(`There was an error while executing a select menu interaction!\nError: ${error}`);
          };
      } else if (interaction.isModalSubmit()) {
          try {
              const Modal = client.modals.get(interaction.customId);
              const typeModals = [...client.typeModals.values()].find(tm => interaction.customId.startsWith(tm.customIdPrefix));
              if (!Modal && !typeModals) {
                interaction.reply({ content: 'This select menu could not be found!', flags: ['Ephemeral'] });
                return;
            };
            if (Modal) {
              Modal.execute(interaction, client);
          } else if (typeModals) {
            typeModals.execute(interaction, client);
          }
          } catch (error) {
              interaction.reply({ content: 'There was an error while trying to execute this interaction!', flags: ['Ephemeral'] });
              console.log(`There was an error while executing a modal interaction!\nError: ${error}`);
          };   
      } else return;
  },
};
