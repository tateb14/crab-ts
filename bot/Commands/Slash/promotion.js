const {
  SlashCommandBuilder,
  InteractionCallback,
  EmbedBuilder,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  MessageFlags,
  inlineCode,
} = require("discord.js");
const CrabPromotion = require("../../schemas/CrabPromotion");
const crabConfig = require("../../schemas/CrabConfig");
const randomString = require("../../Functions/randomId")
module.exports = {
  data: new SlashCommandBuilder()
    .setName("promotion")
    .setDescription("..")
    .addSubcommand((subcommand) =>
      subcommand
        .setName("issue")
        .setDescription("Issue a promotion to a staff member.")
        .addUserOption((option) =>
          option
            .setName("staff-member")
            .setRequired(true)
            .setDescription("Staff member you are to promoting.")
        )
        .addRoleOption((option) =>
          option
            .setName("new-role")
            .setDescription("The new role the staff member is recieving.")
            .setRequired(true)
        )
        .addStringOption((option) =>
          option
            .setName("promotion-notes")
            .setDescription(
              "Any additional notes you want the promoted staff member to know can be provided."
            )
            .setRequired(false)
        )
    ),
  execute: async (interaction, client) => {
    const subcommand = interaction.options.getSubcommand();
    const promotionId = `promotion_${randomString(
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
        const newRole = interaction.options.getRole("new-role");
        const notes =
          interaction.options.getString("punishment-notes") ||
          "No additional notes were provided.";
        const newPromotion = new CrabPromotion({
          guildId: interaction.guild.id,
          promotion_issuedBy: interaction.user.id,
          promotion_staffMember: user.id,
          promotion_newRoleId: newRole.id,
          promotion_notes: notes,
          promotion_id: promotionId
        });
        await newPromotion.save();
        const embed = new EmbedBuilder()
          .setAuthor({
            name: `Issued by @${interaction.user.username}`,
            iconURL: interaction.user.displayAvatarURL(),
          })
          .setTitle("Departmental Promotion")
          .setColor(0xff3b3f)
          .setDescription(
            `A departmental promotion has been issued to ${user}. Details have been provided by the issuing supervisor below.`
          )
          .addFields(
            {
              name: "Promoted to",
              value: `<@&${newRole.id}>`,
            },
            {
              name: "Punishment Notes",
              value: `${notes}`,
            }
          )
          .setFooter({
            text: `Promotion ID: ${promotionId} || Powered by Crab`,
          })
          .setTimestamp();
        const PromotionChannel = GuildConfig.promote_Logs;
        const StaffMember = await client.users.fetch(user);
        if (!PromotionChannel) {
          interaction.reply({ embeds: [embed] });
          await StaffMember.send({ embeds: [embed] });
        } else {
          const channel = await interaction.guild.channels.fetch(
            PromotionChannel
          );
          interaction.reply({ content: "**Successfully** sent the promotion!", flags: MessageFlags.Ephemeral })
          channel.send({ embeds: [embed] });
          await StaffMember.send({ embeds: [embed] });
        }
      } 
    }
  },
};
