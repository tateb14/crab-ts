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

    const CrabServer = await client.guilds.fetch("1265766606555054142");
    if (!CrabServer) {
      return interaction.reply({
        content: "Failed to fetch Tropical Systems guild.",
        ephemeral: true,
      });
    }

    const member = await CrabServer.members.fetch(user.id);
    const flags = await user.fetch();
    const badges = flags.flags.toArray();

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
      { id: "1339431933897085040", badge: "<:crab_crown:1409695241166127214> Tropical Systems Chief Executive Officer" },
      { id: "1398879356192952391", badge: "<:crab_layout_dashboard:1409695234836795613> Tropical Systems Chief Operations Officer" },
      { id: "1398879252425740361", badge: "<:crab_brain:1409695247142879314> Tropical Systems Chief Technology Officer" },
      { id: "1398879405505249453", badge: "<:crab_officer:1349197478720831599> Tropical Systems Director of Human Resources" },
      { id: "1398879051040686151", badge: "<:crab_clipboardlist:1409695242709504051> Tropical Systems Project Manager" },
      { id: "1398879067679359146", badge: "<:crab_settings:1409708164768862289> Tropical Systems Lead Engineer" },
      { id: "1398879030136279080", badge: "<:crab_usersgroup:1409708459779162133> Tropical Systems Community Manager" },
      { id: "1398879010716389376", badge: "<:crab_lifebuoy:1409695233330905198> Tropical Systems Support Manager" },
      { id: "1337250124530847876", badge: "<:crab_tool:1409695228792930354> Tropical Systems Engineer" },
      { id: "1327496680207024199", badge: "<:crab_headset:1409695236153802834> Tropical Systems Support" }
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
    .setColor(0xec3935)
    .setTimestamp()
    .setImage("https://cdn.discordapp.com/attachments/1265767289924354111/1409647765188907291/CrabBanner-EmbedFooter-RedBG.png?ex=68ae2449&is=68acd2c9&hm=643546e45cccda97a49ab46b06c08471d89efbd76f2043d57d0db22cf5a1f657&")
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
