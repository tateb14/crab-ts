const {
  SlashCommandBuilder,
  InteractionCallback,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  MessageFlags,
  inlineCode,
  Message,
} = require("discord.js");
const CrabPunishment = require("../../schemas/CrabPunishment");
const crabConfig = require("../../schemas/CrabConfig");
const randomString = require("../../Functions/randomId");
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
        .setDescription("Search a punishment via user.")
        .addUserOption((option) =>
          option
            .setName("punishment-user")
            .setDescription(
              "The punished user you wish to search."
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
    if (
      !(
        interaction.member.roles.cache.has(Supervisor) ||
        interaction.member.roles.cache.has(HiComm) ||
        interaction.member.roles.cache.has(AARole)
      )
    ) {
      return interaction.reply({
        content: "<:crab_x:1409708189896671357> **Insufficient** permissions.",
      });
    }
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
        punishment_date: Date.now()
      });
      await newPunishment.save();
      const embed = new EmbedBuilder()
        .setAuthor({
          name: `Issued by @${interaction.user.username}`,
          iconURL: interaction.user.displayAvatarURL(),
        })
        .setImage(
          "https://cdn.discordapp.com/attachments/1265767289924354111/1409647765188907291/CrabBanner-EmbedFooter-RedBG.png?ex=68ae2449&is=68acd2c9&hm=643546e45cccda97a49ab46b06c08471d89efbd76f2043d57d0db22cf5a1f657&"
        )
        .setTitle("Departmental Punishment")
        .setColor(0xec3935)
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

      const serverButton = new ButtonBuilder()
        .setCustomId("crab-button_server-name-disabled")
        .setDisabled(true)
        .setStyle(ButtonStyle.Secondary)
        .setLabel(`Sent from ${interaction.guild.name}`)
      const row = new ActionRowBuilder().addComponents(serverButton)
      const PunishmentChannel = GuildConfig.punish_Logs;
      const StaffMember = await client.users.fetch(user);
      if (!PunishmentChannel) {
        interaction.reply({ embeds: [embed] });
        await StaffMember.send({ embeds: [embed], components: [row] });
      } else {
        const channel = await interaction.guild.channels.fetch(
          PunishmentChannel
        );
        interaction.reply({
          content: "<:crab_check:1409695243816669316> **Successfully** sent the punishment.",
          flags: MessageFlags.Ephemeral,
        });
        channel.send({ embeds: [embed] });
        await StaffMember.send({ embeds: [embed], components: [row] });
      }
    } else if (subcommand === "search") {
      const punishmentUser = interaction.options.getUser("punishment-user");
      await interaction.reply({ content: "<:crab_search:1412973394114248857> Fetching punishment records...", flags: MessageFlags.Ephemeral })
      const Punishments = await CrabPunishment.find({ guildId: interaction.guild.id, punishment_staffMember: punishmentUser.id }).limit(10).sort({ _id: -1 })
      let Embeds = []
      if (!Punishments.length) {
        return await interaction.editReply({ content: "<:crab_x:1409708189896671357> I could not find any punishments registered to that user.", flags: MessageFlags.Ephemeral })
      }
      for (const Punishment of Punishments) {
        const Issuer = await interaction.client.users.fetch(Punishment.punishment_issuedBy)
        const User = await interaction.client.users.fetch(Punishment.punishment_staffMember)
        const DateIssued = Punishment.punishment_date
        const PunishmentEmbed = new EmbedBuilder()
        .setAuthor({
          name: `Issued by @${Issuer.username}`,
          iconURL: Issuer.displayAvatarURL(),
        })
        .setImage(
          "https://cdn.discordapp.com/attachments/1265767289924354111/1409647765188907291/CrabBanner-EmbedFooter-RedBG.png?ex=68ae2449&is=68acd2c9&hm=643546e45cccda97a49ab46b06c08471d89efbd76f2043d57d0db22cf5a1f657&"
        )
        .setTitle("Departmental Punishment")
        .setColor(0xec3935)
        .setDescription(
          `A departmental punishment has been issued to ${User}. Details have been provided by the issuing supervisor below.`
        )
        .addFields(
          {
            name: "Punishment Type",
            value: `${Punishment.punishment_type}`,
          },
          {
            name: "Punishment Reason",
            value: `${Punishment.punishment_reason}`,
          },
          {
            name: "Punishment Notes",
            value: `${Punishment.punishment_notes}`,
          }
        )
        .setFooter({
          text: `Punishment ID: ${Punishment.punishment_id} || Powered by Crab`,
        })

        if (!Date) {
          Embeds.push(PunishmentEmbed)
        } else {
          PunishmentEmbed.addFields(
            {
              name: "Punishment Issued:",
              value: `<t:${Math.floor(DateIssued / 1000)}:D>`
            }
          )
          Embeds.push(PunishmentEmbed)
        }

      }
      return interaction.editReply({ content: "<:crab_check:1409695243816669316> **Successfully** fetched the records!", embeds: Embeds, flags: MessageFlags.Ephemeral })
      // ! ADD A DROPDOWN MENU TO SELECT WHICH ONE TO REMOVE (IF ADDING A VOID FEATURE) -- OR -- SHOW ONE RECORD PER PAGE
    }
    if (subcommand === "void") {
      if (
        !(
          interaction.member.roles.cache.has(HiComm) ||
          interaction.member.roles.cache.has(AARole)
        )
      ) {
        return interaction.reply({
          content:
            "<:crab_x:1409708189896671357> **Insufficient** permissions.",
        });
      }
      const punishmentId = interaction.options.getString("punishment-id");
      if (!punishmentId.startsWith("punishment_")) {
        return interaction.reply({ content: "<:crab_x:1409708189896671357> I believe your are attempting to void a different type of log. You attempted to void a **punishment**.", flags: MessageFlags.Ephemeral })
      }
      const punishmentRecord = await CrabPunishment.findOneAndDelete({
        punishment_id: punishmentId,
      });

      try {
        if (punishmentRecord) {
          interaction.reply({
            content: `The punishment record has been found and deleted.\n-# Punishment ID: ${inlineCode(
              punishmentId
            )}`,
            flags: MessageFlags.Ephemeral,
          });
        } else {
          interaction.reply({
            content: "No punishment record with that ID was found.",
            flags: MessageFlags.Ephemeral,
          });
        }
      } catch (error) {
        console.error(error);
      }
    }
  },
};
