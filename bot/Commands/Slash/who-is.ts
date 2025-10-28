import {  SlashCommandBuilder,PermissionFlagsBits,EmbedBuilder,StringSelectMenuBuilder,StringSelectMenuOptionBuilder,ActionRowBuilder,MessageFlags,inlineCode, Interaction, Client, ChatInputCommandInteraction, } from "discord.js"
import { crown, clipboard_list, officer, layout_dashboard, brain, settings, tool, life_buoy, headset, user_group, discord_staff, hs_balance, hs_bravery, hs_brilliance, partnered_server, hype_squad_event, early_supporter, early_verified_app, bug_hunter_1, bug_hunter_2, active_dev, verified_app,mod_program } from "../../../emojis.json"
export default {
  data: new SlashCommandBuilder()
    .setName(`whois`)
    .setDescription(`Get information about yourself or another user!`)
    .addUserOption((user) =>
      user
        .setName(`user`)
        .setDescription(`Select a user you wish to lookup.`)
        .setRequired(false)
    ),
  execute: async (interaction: ChatInputCommandInteraction, client: Client) => {
    if (!interaction.guild) {
      return;
    }
    const user = interaction.options.getUser(`user`) || interaction.user;

    const crabServer = await client.guilds.fetch(`1265766606555054142`);
    if (!crabServer) {
      //! Edit err message
      return interaction.reply({
        content: `Failed to fetch Tropical Systems guild.`,
        ephemeral: true,
      });
    }

    const member = await crabServer.members.fetch(user.id);
    const fetchedUser = await user.fetch();
    const userFlags = fetchedUser.flags
    if (!userFlags) {
      console.log("🪸 No badges found for this user.");
    }
    const badges = userFlags?.toArray();
    const badgeMap: Record<string, string> = {
    'Staff': `${discord_staff} Discord Staff`,
    'Partner': `${partnered_server} Partnered Server Owner`,
    'Hypesquad': `${hype_squad_event} HypeSquad Events`,
    'BugHunterLevel1': `${bug_hunter_1} Bug Hunter Level 1`,
    'BugHunterLevel2': `${bug_hunter_2} Bug Hunter Level 2`,
    'HypeSquadOnlineHouse1': `${hs_bravery} HypeSquad Bravery`,
    'HypeSquadOnlineHouse2': `${hs_brilliance} HypeSquad Brilliance`,
    'HypeSquadOnlineHouse3': `${hs_balance} HypeSquad Balance`,
    'PremiumEarlySupporter': `${early_supporter} Early Supporter`,
    'VerifiedDeveloper': `${early_verified_app} Verified Bot Developer`,
    'CertifiedModerator': `${mod_program} Discord Certified Moderator`,
    'ActiveDeveloper': `${active_dev} Active Developer`,
    };

const roleBadges = [
      { id: `1339431933897085040`, badge: `${crown} Tropical Systems Chief Executive Officer` },
      { id: `1398879356192952391`, badge: `${layout_dashboard} Tropical Systems Chief Operations Officer` },
      { id: `1398879252425740361`, badge: `${brain} Tropical Systems Chief Technology Officer` },
      { id: `1398879405505249453`, badge: `${officer} Tropical Systems Director of Human Resources` },
      { id: `1398879051040686151`, badge: `${clipboard_list} Tropical Systems Project Manager` },
      { id: `1398879067679359146`, badge: `${settings} Tropical Systems Lead Engineer` },
      { id: `1398879030136279080`, badge: `${user_group} Tropical Systems Community Manager` },
      { id: `1398879010716389376`, badge: `${life_buoy} Tropical Systems Support Manager` },
      { id: `1337250124530847876`, badge: `${tool} Tropical Systems Engineer` },
      { id: `1327496680207024199`, badge: `${headset} Tropical Systems Support` }
    ];
    const badgeDisplay = badges!.map(b => badgeMap[b] || b).join('\n');

    const userBadges = []
    if (user.bot) {
      userBadges.push(`${verified_app} User is a bot account.`)
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
    .setImage(`https://cdn.discordapp.com/attachments/1265767289924354111/1409647765188907291/CrabBanner-EmbedFooter-RedBG.png?ex=68ae2449&is=68acd2c9&hm=643546e45cccda97a49ab46b06c08471d89efbd76f2043d57d0db22cf5a1f657&`)
    .setThumbnail(interaction.user.displayAvatarURL())
    .addFields(
      {
        name: `Discord Information:`,
        value: `>>> ${user}\nUser ID: ${user.id}\nJoined Discord: <t:${Math.floor(user.createdAt.getTime() / 1000)}:F>\nJoined Server: <t:${Math.floor(joinTimestamp! / 1000)}:F>`
      },
      {
        name: `Badges [${badgeLines.length}]:`,
        value: `>>> ${badgeLines.join(`\n`)}`
      },
      {
        name: `Roles [${roles.length}]:`,
        value: `>>> ${roles.join(`, `)}`
      },
    )
    
    await interaction.reply({ embeds: [embed] });
    
  },
};
