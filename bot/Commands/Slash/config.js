const { SlashCommandBuilder, PermissionFlagsBits} = require('discord.js');
module.exports = {
    data: new SlashCommandBuilder()
        .setName('config')
        .setDescription("Configure Crab to your liking.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    response: async (interaction) => {
        interaction.reply('TEST')
    }
}
