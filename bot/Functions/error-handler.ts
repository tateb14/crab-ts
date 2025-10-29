import {
  Client,
  ChatInputCommandInteraction,
  ButtonInteraction,
  ModalSubmitInteraction,
  StringSelectMenuInteraction,
  EmbedBuilder,
  codeBlock,
  inlineCode,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  TextChannel,
  Message,
} from "discord.js";
import * as config from "../../config.json";
import { alert } from "../../emojis.json";
import * as chalk from "chalk";
export async function handleInteractionError(
  client: Client,
  interaction:
    | ChatInputCommandInteraction
    | ButtonInteraction
    | ModalSubmitInteraction
    | StringSelectMenuInteraction,
  error: unknown
) {
  const err = error instanceof Error ? error : new Error(String(error));
  const channel = await client.channels.fetch(config.logging.errorLogs) as TextChannel;

  const guildName = interaction.guild?.name || "DM or Unknown Guild";
  const guildId = interaction.guild?.id || "N/A";
  const username = interaction.user?.username || "Unknown User";
  const userId = interaction.user?.id || "N/A";

  const safeError = err.message;
  const safeErrorTrunc = safeError.slice(0, 1024);
  const safeStackRaw = (err.stack || "No stack trace available").slice(0, 1000);
  const safeStack = codeBlock(safeStackRaw);

  const errorReportEmbed = new EmbedBuilder()
    .setTitle("Error Report")
    .setColor(0xec3935)
    .setTimestamp()
    .setDescription(`An error occurred while handling: ${getInteractionInfo(interaction)}`)
    .addFields(
      {
        name: "Guild Information",
        value: `${guildName} :: ${inlineCode(guildId)}`,
      },
      {
        name: "User Information",
        value: `${username} :: ${inlineCode(userId)}`,
      },
      { name: "Error Log", value: safeErrorTrunc },
      { name: "Error Stack", value: safeStack }
    );

  const errorEmbed = new EmbedBuilder()
    .setTitle(`${alert} System Error`)
    .setDescription(
      `An unexpected error has occurred in our system.\n> Our team has been notified and is working on it.`
    )
    .setColor(0xec3935)
    .setTimestamp();

  const link = new ButtonBuilder()
    .setLabel("Join Tropical Systems")
    .setURL("https://discord.gg/tropicalsys")
    .setStyle(ButtonStyle.Link);

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(link);

  await channel.send({
    embeds: [errorReportEmbed],
    content: `<@&${config.roles.onCallRole}>`,
  });

  if (!interaction.replied && !(interaction as any).deferred) {
    await interaction.reply({ embeds: [errorEmbed], components: [row] });
  } else {
    await interaction.editReply({ embeds: [errorEmbed], components: [row] });
  }

  console.log(
    chalk.red.bold("[TS-INTERACTION-ERR] ") +
    `🪸 There was an error while executing an interaction:\n` +
    chalk.gray(err.stack)
  );
}

export async function handleMessageError(
  client: Client,
  message: Message,
  error: unknown
) {
  const err = error instanceof Error ? error : new Error(String(error));
  const channel = await client.channels.fetch(config.logging.errorLogs) as TextChannel;

  const guildName = message.guild?.name || "DM or Unknown Guild";
  const guildId = message.guild?.id || "N/A";
  const username = message.author?.username || "Unknown User";
  const userId = message.author?.id || "N/A";

  const safeError = err.message;
  const safeErrorTrunc = safeError.slice(0, 1024);
  const safeStackRaw = (err.stack || "No stack trace available").slice(0, 1000);
  const safeStack = codeBlock(safeStackRaw);

  const errorReportEmbed = new EmbedBuilder()
    .setTitle("Error Report")
    .setColor(0xec3935)
    .setTimestamp()
    .setDescription(`An error occurred while handling: ${inlineCode(message.content)}`)
    .addFields(
      {
        name: "Guild Information",
        value: `${guildName} :: ${inlineCode(guildId)}`,
      },
      {
        name: "User Information",
        value: `${username} :: ${inlineCode(userId)}`,
      },
      { name: "Error Log", value: safeErrorTrunc },
      { name: "Error Stack", value: safeStack }
    );

  const errorEmbed = new EmbedBuilder()
    .setTitle(`${alert} System Error`)
    .setDescription(
      `An unexpected error has occurred in our system.\n> Our team has been notified and is working on it.`
    )
    .setColor(0xec3935)
    .setTimestamp();

  const link = new ButtonBuilder()
    .setLabel("Join Tropical Systems")
    .setURL("https://discord.gg/tropicalsys")
    .setStyle(ButtonStyle.Link);

  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(link);

  await channel.send({
    embeds: [errorReportEmbed],
    content: `<@&${config.roles.onCallRole}>`,
  });
  
  await message.reply({ embeds: [errorEmbed], components: [row] });

  console.log(
    chalk.red.bold("[TS-MESSAGE-ERR] ") +
    `🪸 There was an error while executing a prefix command:\n` +
    chalk.gray(err.stack)
  );
}
