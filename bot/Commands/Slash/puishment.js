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
const punishmentMap = new Map()
const { x, check, search } = require("../../../emojis.json")
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
        content: `${x} **Insufficient** permissions.`,
      });
    }
    if (subcommand === "issue") {
      const user = interaction.options.getUser("staff-member");
      const type = interaction.options.getString("punishment-type");
      const reason = interaction.options.getString("punishment-reason");
      const notes =interaction.options.getString("punishment-notes") || "No additional notes were provided.";
      await interaction.reply(`${search} **Processing** you punishment...`)
      if (user.id === interaction.user.id) {
        return await interaction.editReply({ content: `${x} You cannot punish yourself.`, flags: MessageFlags.Ephemeral })
      }
      if (user.bot) {
        return await interaction.editReply({ content: `${x} You cannot punish a bot.`, flags: MessageFlags.Ephemeral })
      }
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
        await interaction.editReply({ embeds: [embed] });
        await StaffMember.send({ embeds: [embed], components: [row] });
      } else {
        const channel = await interaction.guild.channels.fetch(
          PunishmentChannel
        );
        await interaction.editReply({
          content: `${check} **Successfully** sent the punishment.`,
          flags: MessageFlags.Ephemeral,
        });
        channel.send({ embeds: [embed] });
        await StaffMember.send({ embeds: [embed], components: [row] });
      }
    } else if (subcommand === "search") {
      const punishmentUser = interaction.options.getUser("punishment-user");
      await interaction.reply({ content: `${search} **Fetching** punishment records...`, flags: MessageFlags.Ephemeral })
      const Punishments = await CrabPunishment.find({ guildId: interaction.guild.id, punishment_staffMember: punishmentUser.id }).limit(10).sort({ _id: -1 })
      let Embeds = []
      if (!Punishments.length) {
        return await interaction.editReply({ content: `${x} I could not find any punishments registered to that user.`, flags: MessageFlags.Ephemeral })
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
      return interaction.editReply({ content: `${check} **Successfully** fetched the records!`, embeds: Embeds, flags: MessageFlags.Ephemeral })
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
            `${x} **Insufficient** permissions.`,
        });
      }
        const PunishmentId = interaction.options.getString("punishment-id")
        await interaction.reply({ content: `${search} **Fetching** the punishment...` })
        const response = await interaction.fetchReply();
        const Punishment = await CrabPunishment.findOne({ guildId: interaction.guild.id, punishment_id: PunishmentId })
        if (!Punishment) {
          return await interaction.editReply({ content: `${x} I was unable to locate a punishment with that id, please double check the ID and try again.` })
        }
        const tempId = Math.floor(100000 + Math.random() * 900000).toString();
        punishmentMap.set(tempId, PunishmentId);
        const confirmDelete = new ButtonBuilder()
        .setCustomId(`crab_button-confirm_delete:${response.id}:${interaction.user.id}:${tempId}`)
        .setEmoji(check)
        .setLabel("Confirm Delete")
        .setStyle(ButtonStyle.Danger)
         const cancelDelete = new ButtonBuilder()
        .setCustomId(`crab_button-cancel_delete:${response.id}:${interaction.user.id}`)
        .setEmoji(x)
        .setLabel("Cancel Delete")
        .setStyle(ButtonStyle.Secondary)

        const confirmationRow = new ActionRowBuilder().addComponents(confirmDelete, cancelDelete)
        await interaction.editReply({ content: `${check} I was able to locate a punishment with this id string, would you like to proceed and void the report?\n-# This action is **irreversible**.`, components: [confirmationRow] })
    }
  },
  punishmentMap
};
