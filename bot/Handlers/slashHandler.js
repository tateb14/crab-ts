const { REST, Routes } = require('discord.js');
const fs = require('fs');
const path = require('path');
const config = require('../../config.json');

module.exports = async (client) => {
    const rest = new REST({ version: '10' }).setToken(process.env.TOKEN);
    client.slashCommands = new Map()
    const Commands = [];
    const CommandsFolder = fs.readdirSync('bot/Commands/Slash').filter(command => command.endsWith(".js"));
    const SlashCommandPath = path.join(__dirname, '../Commands/Slash');

    try {
        for (const File of CommandsFolder) {
            const FilePath = path.join(SlashCommandPath, File);
            const Command = require(FilePath);

            if ('data' in Command && 'execute' in Command) {
                const commandData = Command.data.toJSON()
                client.slashCommands.set(commandData.name, Command);
                Commands.push(commandData);
            }
        }

        await rest.put(Routes.applicationCommands(config.clientId), { body: Commands })

        console.log('🐚 Successfully registered all (/) commands.')
    } catch (error) {
        console.error(`There was an error while registering (/) commands: ${error}`);
    }
}
