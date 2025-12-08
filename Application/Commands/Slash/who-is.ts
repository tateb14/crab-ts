import { SlashCommandBuilder, EmbedBuilder, ChatInputCommandInteraction, Client, AttachmentBuilder } from "discord.js";
import * as emojis from "../../../emojis.json";

import * as staffRoles from "../../../staff-roles.json";
import * as config from "../../../config.json";

export default {
    data: new SlashCommandBuilder()
        .setName("whois")
        .setDescription("Get information about yourself or another user!")
        .addUserOption((user) => user.setName("user").setDescription("Select a user you wish to lookup.").setRequired(false)),

    execute: async (interaction: ChatInputCommandInteraction, client: Client) => {
        //? command data
        const user = interaction.options.getUser("user") || interaction.user;

        //? global checks
        const guild = interaction.guild;

        if (!guild) return;

        // ? define the image
        const embedFooter = new AttachmentBuilder("Images/footer-banner.png", {
            name: "embed-footer-banner.png",
        });
        // ? Try to fetch member in current guild
        let guildMember;
        try {
            guildMember = await guild.members.fetch(user.id);
        } catch {}

        // ? Try to fetch member in support server
        let staffMember;
        try {
            const supportGuild = await client.guilds.cache.get(config.guilds["ts-main"]);
            if (!supportGuild) {
                console.warn(`Support guild ${config.guilds["ts-main"]} not found. Is the bot in that server?`);
                staffMember = null;
            }
            staffMember = await supportGuild!.members.fetch(user.id);
        } catch (error) {
            console.log("Error fetching staff member:", error);
        }


        // * define the creation date of the acc.
        const createdDate = user.createdAt.getTime();
        const embed = new EmbedBuilder()
            .setAuthor({
                name: `@${user.username}`,
                iconURL: user.displayAvatarURL(),
            })
            .setColor(0xec3935)
            .setTimestamp()
            .setThumbnail(user.displayAvatarURL())
            .setImage("attachment://embed-footer-banner.png")
            .addFields({
                name: "Discord Information:",
                value: `>>> ${user}\nUser ID: ${user.id}\nJoined Discord: <t:${Math.floor(createdDate / 1000)}:D>${guildMember?.joinedTimestamp ? `\nJoined Server: <t:${Math.floor(guildMember.joinedTimestamp / 1000)}:D>` : ""}`,
            });

        const fetchedUser = await user.fetch();
        const badges = fetchedUser.flags?.toArray?.() || [];

        // Filter out redundant verified badges for bots
        const filteredBadges = user.bot ? badges.filter((b) => !["VerifiedBot", "VerifiedBotDeveloper", "VerifiedDeveloper"].includes(b)) : badges;

        // Badge-to-emoji map
        const badgeMap: Record<string, string> = {
            Staff: `${emojis.discord_staff} Discord Staff`,
            Partner: `${emojis.partnered_server} Partnered Server Owner`,
            Hypesquad: `${emojis.hype_squad_event} HypeSquad Events`,
            BugHunterLevel1: `${emojis.bug_hunter_1} Bug Hunter Level 1`,
            BugHunterLevel2: `${emojis.bug_hunter_2} Bug Hunter Level 2`,
            HypeSquadOnlineHouse1: `${emojis.hs_bravery} HypeSquad Bravery`,
            HypeSquadOnlineHouse2: `${emojis.hs_brilliance} HypeSquad Brilliance`,
            HypeSquadOnlineHouse3: `${emojis.hs_balance} HypeSquad Balance`,
            PremiumEarlySupporter: `${emojis.early_supporter} Early Supporter`,
            VerifiedDeveloper: `${emojis.early_verified_app} Verified Bot Developer`,
            CertifiedModerator: `${emojis.mod_program} Discord Certified Moderator`,
            ActiveDeveloper: `${emojis.active_dev} Active Developer`,
        };

        // Map filtered badges
        const badgeDisplay = filteredBadges.map((b) => badgeMap[b] || b);

        // Always show bot badge if bot
        if (user.bot) badgeDisplay.push(`${emojis.verified_app} Bot Account`);
        if (badgeDisplay.length !== 0) {
            embed.addFields({
                name: `Badges [${badgeDisplay.length}]:`,
                value: `>>> ${badgeDisplay.join("\n") || "None"}`,
            });
        }
        // Role display
        let roles: string[] = [];
        if (guildMember) {
            const everyoneRole = interaction.guild.roles.everyone;
            roles = guildMember.roles.cache
                .filter((r) => r.id !== everyoneRole.id)
                .sort((a, b) => b.position - a.position)
                .map((r) => r.toString());
        }
        if (roles.length !== 0) {
            embed.addFields({
                name: `Roles [${roles.length}]:`,
                value: `>>> ${roles.join(", ") || "None"}`,
            });
        }

        // Build base embed

        let staffTitle = null;
        let staffEmoji = null;

        if (staffMember) {
            console.log(
                "Staff member roles:",
                staffMember.roles.cache.map((r) => `${r.name} (${r.id})`)
            );
            console.log("Staff roles config:", Object.keys(staffRoles));

            const match = Object.entries(staffRoles).find(([roleId]) => staffMember.roles.cache.has(roleId));

            if (match) {
                const [roleId, data] = match;
                staffTitle = data.name;
                staffEmoji = data.emoji;
                console.log("Match found:", data);
            } else {
                console.log("No matching staff role found");
            }
        }

        let staffStatus;
        if (staffTitle) {
            staffStatus = `${staffEmoji} ${staffTitle}`;
            embed.setDescription(`${staffStatus}`)
        }

        return interaction.reply({ embeds: [embed], files: [embedFooter] });
    },
};
