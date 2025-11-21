import { EmbedBuilder, inlineCode, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags, ButtonInteraction, Client, GuildMember, } from "discord.js";

const CrabConfig = require("../../schemas/CrabConfig");
const GuildRecord = require("../../schemas/GuildRecord");

module.exports = {
  customId: "crab-button_record-approve",
  execute: async (interaction: ButtonInteraction, client: Client) => {
    const guild = interaction.guild;
    const member = interaction.member as GuildMember;
    
    if (!guild || !(member instanceof GuildMember))
    {
        return;
    }

    const guildConfig = await CrabConfig.findOne(
    {
      guildId: interaction.guild.id,
    });

    const supervisorRole = guildConfig.perms_SupervisorRole;
    const hiCommRole = guildConfig.perms_HiCommRole;
    const aARole = guildConfig.perms_AllAccessRole;

    if (member.roles.cache.has(supervisorRole) || member.roles.cache.has(hiCommRole) || member.roles.cache.has(aARole)) 
    {
      const Record = await GuildRecord.findOneAndUpdate(
        { messageId: interaction.message.id }, { $set: { reviewedBy: interaction.user.id } }, { new: true }
      );
      
      const embed = interaction.message.embeds[0];
      const user = await interaction.guild.members.fetch(Record.issuedBy);
      const approvedEmbed = EmbedBuilder.from(embed);
      approvedEmbed.setColor(0x2a9d8f);

      const serverButton = new ButtonBuilder()
        .setCustomId("crab-button_server-name-disabled")
        .setDisabled(true)
        .setStyle(ButtonStyle.Secondary)
        .setLabel(`Sent from ${interaction.guild.name}`);

      const row = new ActionRowBuilder().addComponents(serverButton);

      interaction.update({
        content: `This record has been approved by ${interaction.user}`,
        embeds: [approvedEmbed],
        components: [],
      });
      if (user) {
        try {
          await user.send({
            content: `**Record ID:** ${inlineCode(
              Record.id
            )} has been approved by ${interaction.user}`,
            components: [row],
          });
        } catch (err) {
          return interaction.followUp({
            content: "I could not DM this user.",
            flags: MessageFlags.Ephemeral,
          });
        }
      }
    } else {
      interaction.reply({
        content: "**Insufficient** permissions.",
        flags: MessageFlags.Ephemeral,
      });
    }
  },
};