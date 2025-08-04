const {
  SlashCommandBuilder,
  PermissionFlagsBits,
  EmbedBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder,
  MessageFlags,
  inlineCode,
} = require("discord.js");
module.exports = {
  data: new SlashCommandBuilder()
    .setName("whois")
    .setDescription("Get information about yourself or another user!")
    .addUserOption((user) =>
      user
        .setName("user")
        .setDescription("Select a user you wish to lookup.")
        .setRequired(false)
    ),
  execute: async (interaction, client) => {
    const user = interaction.options.getUser("user") || interaction.user;

    const CrabServer = await client.guilds.fetch("1350297958037590061");
    if (!CrabServer) {
      return interaction.reply({
        content: "Failed to fetch Tropical Systems guild.",
        ephemeral: true,
      });
    }

    const member = await CrabServer.members.fetch(user.id);
    const flags = await user.fetchFlags();
    const badges = flags.toArray();

const badgeMap = {
  'Staff': '<:crab_discordstaff:1400658440484946062> Discord Staff',
  'Partner': '<:crab_partneredserverowner:1400658462240936097> Partnered Server Owner',
  'Hypesquad': '<:discord_hypesquadevent:1400658463897686137> HypeSquad Events',
  'BugHunterLevel1': '<:crab_bughunter1:1400658437674762400> Bug Hunter Level 1',
  'BugHunterLevel2': '<:crab_bughunter2:1400658439138443334> Bug Hunter Level 2',
  'HypeSquadOnlineHouse1': '<:crab_hsbravery:1400658446055116820> HypeSquad Bravery',
  'HypeSquadOnlineHouse2': '<:crab_hsbrilliance:1400658453210595369> HypeSquad Brilliance',
  'HypeSquadOnlineHouse3': '<:crab_hsbalance:1400658445098815679> HypeSquad Balance',
  'PremiumEarlySupporter': '<:crab_earlysupporterdiscord:1400658442229649449> Early Supporter',
  'VerifiedDeveloper': '<:crab_earlyverifiedbotdevdiscord:1400658443907629216> Verified Bot Developer',
  'CertifiedModerator': '<:crab_modprogramalumnidiscord:1400658460659417168> Discord Certified Moderator',
  'ActiveDeveloper': '<:crab_activedevdiscord:1400658433308360834> Active Developer',
};

const roleBadges = [
      { id: "1350301437703491614", badge: "<:crab_crown:1400634899878383656> Tropical Systems Chief Executive Officer" },
      { id: "1350301707162091671", badge: "<:crab_layoutdashboard:1400636945171873842> Tropical Systems Chief Operations Officer" },
      { id: "1350305189566877877", badge: "<:crab_brain:1400634896883646556> Tropical Systems Chief Technology Officer" },
      { id: "1350302882821570640", badge: "<:crab_officer:1349197478720831599> Tropical Systems Director of Human Resources" },
      { id: "1352121634743517184", badge: "<:crab_clipboardlist:1400634898473160764> Tropical Systems Project Manager" },
      { id: "1350304233521414194", badge: "<:crab_settings:1400634904068362331> Tropical Systems Lead Engineer" },
      { id: "1352121671154139216", badge: "<:crab_usersgroup:1400634906513641593> Tropical Systems Community Manager" },
      { id: "1378067036038500383", badge: "<:crab_lifebuoy:1400634902734573701> Tropical Systems Support Manager" },
      { id: "1350304202273853471", badge: "<:crab_tool:1400634905238569032> Tropical Systems Engineer" },
      { id: "1350304776138653788", badge: "<:crab_headset:1400634901086076958> Tropical Systems Support" }
    ];
    const badgeDisplay = badges
    .map(b => badgeMap[b] || b)
    .join('\n');

    const userBadges = []
    if (user.bot) {
      userBadges.push("<:crab_verifiedapp:1401264909077053532> User is a bot account.")
    } 
    
    const foundBadge = roleBadges.find(roleBadge => member.roles.cache.has(roleBadge.id)); 
    const targetUserId = user.id; 
    const guildMember = await interaction.guild.members.fetch(targetUserId);
    const joinTimestamp = guildMember.joinedTimestamp;
    const badgeLines = [foundBadge?.badge, userBadges, badgeDisplay].filter(Boolean);
    const memberRoles = guildMember.roles.cache
    const everyoneRole = interaction.guild.roles.everyone;
    const roles = memberRoles.map(role => role).filter(role => role.id !== everyoneRole.id).sort((a, b) => b.position - a.position);
    const embed = new EmbedBuilder()
    .setAuthor({ name: `@${user.username}`, iconURL: user.displayAvatarURL() })
    .setColor(0x6A994E)
    .setTimestamp()
    .setThumbnail(interaction.user.displayAvatarURL())
    .addFields(
      {
        name: "Discord Information:",
        value: `>>> ${user}\nUser ID: ${user.id}\nJoined Discord: <t:${Math.floor(user.createdAt / 1000)}:F>\nJoined Server: <t:${Math.floor(joinTimestamp / 1000)}:F>`
      },
      {
        name: `Badges [${badgeLines.length}]:`,
        value: `>>> ${badgeLines.join("\n")}`
      },
      {
        name: `Roles [${roles.length}]:`,
        value: `>>> ${roles.join(", ")}`
      },
    )
    
    await interaction.reply({ embeds: [embed] });
    
  },
};
