"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.handleInteractionError = handleInteractionError;
exports.handleMessageError = handleMessageError;
const discord_js_1 = require("discord.js");
const config = require("../../config.json");
const emojis_json_1 = require("../../emojis.json");
const chalk = require("chalk");
async function handleInteractionError(client, interaction, error) {
    const err = error instanceof Error ? error : new Error(String(error));
    const channel = await client.channels.fetch(config.logging.errorLogs);
    const guildName = interaction.guild?.name || "DM or Unknown Guild";
    const guildId = interaction.guild?.id || "N/A";
    const username = interaction.user?.username || "Unknown User";
    const userId = interaction.user?.id || "N/A";
    const safeError = err.message;
    const safeErrorTrunc = safeError.slice(0, 1024);
    const safeStackRaw = (err.stack || "No stack trace available").slice(0, 1000);
    const safeStack = (0, discord_js_1.codeBlock)(safeStackRaw);
    const errorReportEmbed = new discord_js_1.EmbedBuilder()
        .setTitle("Error Report")
        .setColor(0xec3935)
        .setTimestamp()
        .setDescription(`An error occurred while handling: ${getInteractionInfo(interaction)}`)
        .addFields({
        name: "Guild Information",
        value: `${guildName} :: ${(0, discord_js_1.inlineCode)(guildId)}`,
    }, {
        name: "User Information",
        value: `${username} :: ${(0, discord_js_1.inlineCode)(userId)}`,
    }, { name: "Error Log", value: safeErrorTrunc }, { name: "Error Stack", value: safeStack });
    const errorEmbed = new discord_js_1.EmbedBuilder()
        .setTitle(`${emojis_json_1.alert} System Error`)
        .setDescription(`An unexpected error has occurred in our system.\n> Our team has been notified and is working on it.`)
        .setColor(0xec3935)
        .setTimestamp();
    const link = new discord_js_1.ButtonBuilder()
        .setLabel("Join Tropical Systems")
        .setURL("https://discord.gg/tropicalsys")
        .setStyle(discord_js_1.ButtonStyle.Link);
    const row = new discord_js_1.ActionRowBuilder().addComponents(link);
    await channel.send({
        embeds: [errorReportEmbed],
        content: `<@&${config.roles.onCallRole}>`,
    });
    if (!interaction.replied && !interaction.deferred) {
        await interaction.reply({ embeds: [errorEmbed], components: [row] });
    }
    else {
        await interaction.editReply({ embeds: [errorEmbed], components: [row] });
    }
    console.log(chalk.red.bold("[TS-INTERACTION-ERR] ") +
        `🪸 There was an error while executing an interaction:\n` +
        chalk.gray(err.stack));
}
async function handleMessageError(client, message, error) {
    const err = error instanceof Error ? error : new Error(String(error));
    const channel = await client.channels.fetch(config.logging.errorLogs);
    const guildName = message.guild?.name || "DM or Unknown Guild";
    const guildId = message.guild?.id || "N/A";
    const username = message.author?.username || "Unknown User";
    const userId = message.author?.id || "N/A";
    const safeError = err.message;
    const safeErrorTrunc = safeError.slice(0, 1024);
    const safeStackRaw = (err.stack || "No stack trace available").slice(0, 1000);
    const safeStack = (0, discord_js_1.codeBlock)(safeStackRaw);
    const errorReportEmbed = new discord_js_1.EmbedBuilder()
        .setTitle("Error Report")
        .setColor(0xec3935)
        .setTimestamp()
        .setDescription(`An error occurred while handling: ${(0, discord_js_1.inlineCode)(message.content)}`)
        .addFields({
        name: "Guild Information",
        value: `${guildName} :: ${(0, discord_js_1.inlineCode)(guildId)}`,
    }, {
        name: "User Information",
        value: `${username} :: ${(0, discord_js_1.inlineCode)(userId)}`,
    }, { name: "Error Log", value: safeErrorTrunc }, { name: "Error Stack", value: safeStack });
    const errorEmbed = new discord_js_1.EmbedBuilder()
        .setTitle(`${emojis_json_1.alert} System Error`)
        .setDescription(`An unexpected error has occurred in our system.\n> Our team has been notified and is working on it.`)
        .setColor(0xec3935)
        .setTimestamp();
    const link = new discord_js_1.ButtonBuilder()
        .setLabel("Join Tropical Systems")
        .setURL("https://discord.gg/tropicalsys")
        .setStyle(discord_js_1.ButtonStyle.Link);
    const row = new discord_js_1.ActionRowBuilder().addComponents(link);
    await channel.send({
        embeds: [errorReportEmbed],
        content: `<@&${config.roles.onCallRole}>`,
    });
    await message.reply({ embeds: [errorEmbed], components: [row] });
    console.log(chalk.red.bold("[TS-MESSAGE-ERR] ") +
        `🪸 There was an error while executing a prefix command:\n` +
        chalk.gray(err.stack));
}
