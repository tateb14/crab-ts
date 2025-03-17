module.exports = {
  event: 'interactionCreate',
  once: false,
  execute: async (client, interaction) => {

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
              if (!Modal) {
                  interaction.reply({ content: 'This modal could not be found!', flags: ['Ephemeral'] });
                  return;
              };
              Modal.execute(interaction, client);
          } catch (error) {
              interaction.reply({ content: 'There was an error while trying to execute this interaction!', flags: ['Ephemeral'] });
              console.log(`There was an error while executing a modal interaction!\nError: ${error}`);
          };   
      } else return;
  },
};
