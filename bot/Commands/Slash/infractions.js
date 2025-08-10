const {
  SlashCommandBuilder,
  InteractionCallback,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  MessageFlags,
  inlineCode
} = require("discord.js");
const CrabPunishment = require("../../schemas/CrabPunishment");
const crabConfig = require("../../schemas/CrabConfig");
const randomString = require("../../Functions/randomId")
module.exports = {
  data: new SlashCommandBuilder()
    .setName("punishment")
    .setDescription("..")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("issue")
        .setDescription("Issue a punishment to a staff member.")
        .addUserOption((option) =>
          option
            .setName("staff-member")
            .setRequired(true)
            .setDescription("Staff member you are to punishing.")
        )
        .addStringOption((option) =>
          option
            .setName("punishment-type")
            .setRequired(true)
            .setDescription("Type of punishment you are issuing.")
            .addChoices(
              { name: "Warning", value: "Departmental Warning" },
              { name: "Strike", value: "Departmental Strike" },
              { name: "Suspension", value: "Departmental Suspension" },
              { name: "Termination", value: "Departmental Termination" }
            )
        )
        .addStringOption((option) =>
          option
            .setName("punishment-reason")
            .setDescription("Reason for the punishment you are issuing.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("punishment-notes")
            .setDescription(
              "Any additional notes you want the punished staff member to know can be provided."
            )
            .setRequired(false)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("search")
        .setDescription("Search a punishment via identification string.")
        .addStringOption((option) =>
          option
            .setName("punishment-id")
            .setDescription(
              "The punishment identiification number given when the punishment was issued."
            )
            .setRequired(true)
        )
    )
    .addSubcommand((subcommand) =>
      subcommand
        .setName("void")
        .setDescription("Void/Delete a punishment via identification string.")
        .addStringOption((option) =>
          option
            .setName("punishment-id")
            .setDescription(
              "The punishment identiification number given when the punishment was issued."
            )
            .setRequired(true)
        )
    ),
  execute: async (interaction, client) => {
    const subcommand = interaction.options.getSubcommand();
    const punishmentId = `punishment_${randomString(
      24,
      "0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ"
    )}`;
    const GuildConfig = await crabConfig.findOne({
      guildId: interaction.guild.id,
    });
    const Supervisor = GuildConfig.perms_SupervisorRole;
    const HiComm = GuildConfig.perms_HiCommRole;
    const AARole = GuildConfig.perms_AllAccessRole;
    if (interaction.member.roles.cache.has(Supervisor || HiComm || AARole)) {
      if (subcommand === "issue") {
        const user = interaction.options.getUser("staff-member");
        const type = interaction.options.getString("punishment-type");
        const reason = interaction.options.getString("punishment-reason");
        const notes =
          interaction.options.getString("punishment-notes") ||
          "No additional notes were provided.";
        const newPunishment = new CrabPunishment({
          guildId: interaction.guild.id,
          punishment_id: punishmentId,
          punishment_reason: reason,
          punishment_issuedBy: interaction.user.id,
          punishment_staffMember: user.id,
          punishment_type: type,
          punishment_notes: notes,
        });
        await newPunishment.save();
        const embed = new EmbedBuilder()
          .setAuthor({
            name: `Issued by @${interaction.user.username}`,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setTitle("Departmental Punishment")
          .setColor(0xff3b3f)
          .setDescription(
            `A departmental punishment has been issued to ${user}. Details have been provided by the issuing supervisor below.`
          )
          .addFields(
            {
              name: "Punishment Type",
              value: `${type}`,
            },
            {
              name: "Punishment Reason",
              value: `${reason}`,
            },
            {
              name: "Punishment Notes",
              value: `${notes}`,
            }
          )
          .setFooter({
            text: `Punishment ID: ${punishmentId} || Powered by Crab`,
          })
          .setTimestamp();
        const PunishmentChannel = GuildConfig.punish_Logs;
        const StaffMember = await client.users.fetch(user);
        if (!PunishmentChannel) {
          interaction.reply({ embeds: [embed] });
          await StaffMember.send({ embeds: [embed] });
        } else {
          const channel = await interaction.guild.channels.fetch(
            PunishmentChannel
          );
          interaction.reply({ content: "**Successfully** sent the punishment.", flags: MessageFlags.Ephemeral })
          channel.send({ embeds: [embed] });
          await StaffMember.send({ embeds: [embed] });
        }
      } else if (subcommand === "search") {
        const punishmentId = interaction.options.getString("punishment-id");
        const PunishmentResult = await CrabPunishment.findOne({
          guildId: interaction.guild.id,
          punishment_id: punishmentId,
        });
        if (!PunishmentResult || PunishmentResult.length === 0) {
          return interaction.reply({
            content:
              "No punishment was found under that identificaiton string.",
            flags: MessageFlags.Ephemeral,
          });
        } else {
          const embed = new EmbedBuilder()
            .setAuthor({
              name: `Search requested by @${interaction.user.username}`,
              iconURL: interaction.user.displayAvatarURL(),
            })
            .setTitle("Departmental Punishment")
            .setColor(0xff3b3f)
            .setDescription(
              `A departmental punishment has been **found**, addressed to <@${PunishmentResult.punishment_staffMember}>. Details have been provided below.`
            )
            .addFields(
              {
                name: "Punishment Type",
                value: `${PunishmentResult.punishment_type}`,
              },
              {
                name: "Punishment Reason",
                value: `${PunishmentResult.punishment_reason}`,
              },
              {
                name: "Punishment Notes",
                value: `${PunishmentResult.punishment_notes}`,
              },
              {
                name: "Punishment Issuer",
                value: `<@${PunishmentResult.punishment_issuedBy}>`,
              }
            )
            .setFooter({
              text: `Punishment ID: ${punishmentId} || Powered by Crab`,
            });
            interaction.reply({ content: "A punishment log has been located and is displayed below.", embeds: [embed], flags: MessageFlags.Ephemeral })
        }
      }
    } else {
      interaction.reply({
        content: "**Insufficient** permissions.",
        flags: MessageFlags.Ephemeral,
      });
    }
    if (interaction.member.roles.cache.has(HiComm || AARole)) {
      if (subcommand === "void") {
        const punishmentId = interaction.options.getString("punishment-id");
        const punishmentRecord = await CrabPunishment.findOneAndDelete({ punishment_id: punishmentId });
        try {
          if (punishmentRecord) {
            interaction.reply({content: `The punishment record has been found and deleted.\n-# Punishment ID: ${inlineCode(punishmentId)}`, flags: MessageFlags.Ephemeral});
          } else {
            interaction.reply({content: "No punishment record with that ID was found.", flags: MessageFlags.Ephemeral});
          }
        } catch (error) {
          console.error(error);
        }
      }
    }
  },
};
