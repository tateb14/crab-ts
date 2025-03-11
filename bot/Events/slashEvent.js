module.exports = {
    event: "interactionCreate",
    once: false,
    response: async (client, interaction) => {
        if (!interaction.isCommand()) return;
        if (interaction.isContextMenuCommand()) return;

        const Commands = client.slashCommands.get(interaction.commandName)
        if (!Commands) {
            interaction.reply({ content: 'The command could not be found. Please contact support if you believe this is an error.', flags: ['Ephemeral'] })
        }
        try {
            Commands.response(interaction, client);
        } catch (error) {
            console.error(`There was an error while running a command: ${interaction.commandName}\n\n Error: ${error}`);
        }
    }
}
