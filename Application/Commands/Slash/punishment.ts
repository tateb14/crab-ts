import { SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder, MessageFlags, ChatInputCommandInteraction, Client, GuildMember, Guild, TextChannel, AttachmentBuilder } from "discord.js";
import crabPunishment from "../../Models/crab-punishment";
import crabConfig from "../../Models/crab-config";
import { generateDatabaseIdString } from "../../Functions/randomId";
const punishmentMap = new Map();
import * as emojis from "../../../emojis.json";
export default {
    data: new SlashCommandBuilder()
        .setName("punishment")
        .setDescription("..")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("issue")
                .setDescription("Issue a punishment to a staff member.")
                .addUserOption((option) => option.setName("staff-member").setRequired(true).setDescription("Staff member you are to punishing."))
                .addStringOption((option) =>
                    option.setName("punishment-type").setRequired(true).setDescription("Type of punishment you are issuing.").addChoices(
                        { name: "Warning", value: "Departmental Warning" },
                        { name: "Strike", value: "Departmental Strike" },
                        {
                            name: "Suspension",
                            value: "Departmental Suspension",
                        },
                        {
                            name: "Termination",
                            value: "Departmental Termination",
                        }
                    )
                )
                .addStringOption((option) => option.setName("punishment-reason").setDescription("Reason for the punishment you are issuing.").setRequired(true))
                .addStringOption((option) => option.setName("punishment-notes").setDescription("Any additional notes you want the punished staff member to know can be provided.").setRequired(false))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("search")
                .setDescription("Search a punishment via user.")
                .addUserOption((option) => option.setName("punishment-user").setDescription("The punished user you wish to search.").setRequired(true))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("void")
                .setDescription("Void/Delete a punishment via identification string.")
                .addStringOption((option) => option.setName("punishment-id").setDescription("The punishment identiification number given when the punishment was issued.").setRequired(true))
        ),
    execute: async (interaction: ChatInputCommandInteraction, client: Client) => {
        //? Fetch the subcommand from the command.
        const subcommand = interaction.options.getSubcommand();

        //? generates the database ID
        const punishmentId = `punishment_${generateDatabaseIdString()}`;

        //? Global checks & definitions
        const guild = interaction.guild as Guild;
        const member = interaction.member as GuildMember;

        if (!guild || !member || !interaction.user) return;

        //? fetch guild config
        const guildConfig = await crabConfig.findOne({ guildId: guild.id });

        //? Embed footer banner attachment initialization
        const embedFooter = new AttachmentBuilder("Images/footer-banner.png", {
            name: "embed-footer-banner.png",
        });

        //? Fetch permission roles
        const supervisorRoleId = guildConfig!.perms_SupervisorRole;
        const highCommRoleId = guildConfig!.perms_HiCommRole;
        const allAccessRoleId = guildConfig!.perms_AllAccessRole;

        //? Check user permissions
        if (!member.roles.cache.hasAny(supervisorRoleId, highCommRoleId, allAccessRoleId)) {
            //? If they do not have the proper permissions, they are denied.
            return interaction.reply({
                content: `${emojis.x}, **@${interaction.user.username}**, you cannot use this command.`,
                flags: MessageFlags.Ephemeral,
            });
        }

        if (subcommand === "issue") {
            //? Issue subcommand
            //? get command data
            const user = interaction.options.getUser("staff-member");
            const type = interaction.options.getString("punishment-type");
            const reason = interaction.options.getString("punishment-reason");
            const notes = interaction.options.getString("punishment-notes") || "No additional notes were provided.";

            //* reply to process
            await interaction.reply(`${emojis.search} **Processing** you punishment...`);

            //? Check if the user is not trying to punish themselves or a bot.
            if (user!.id === interaction.user.id) {
                return await interaction.editReply({ content: `${emojis.x} You cannot punish yourself.` });
            }
            if (user!.bot) {
                return await interaction.editReply({ content: `${emojis.x} You cannot punish a bot.` });
            }
            //? define new punishment record
            const newPunishment = new crabPunishment({
                guildId: guild.id,
                punishment_id: punishmentId,
                punishment_reason: reason,
                punishment_issuedBy: interaction.user.id,
                punishment_staffMember: user!.id,
                punishment_type: type,
                punishment_notes: notes,
                punishment_date: Date.now(),
            });

            //* embed
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: `Issued by @${interaction.user.username}`,
                    iconURL: interaction.user.displayAvatarURL(),
                })
                .setImage("attachment://embed-footer-banner.png")
                .setTitle("Departmental Punishment")
                .setColor(0xec3935)
                .setDescription(`A departmental punishment has been issued to ${user}. Details have been provided by the issuing supervisor below.`)
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
            //* create server button
            const serverButton = new ButtonBuilder().setCustomId("crab-button_server-name-disabled").setDisabled(true).setStyle(ButtonStyle.Secondary).setLabel(`Sent from ${guild.name}`);
            //* define new row
            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(serverButton);
            //? fetch punishmentChannelId
            const punishmentChannelId = guildConfig!.punish_Logs;
            const staffMember = await client.users.fetch(user!);
            let punishmentChannel = (await guild.channels.fetch(punishmentChannelId)) as TextChannel;

            //? if no punishment channel, it will send to the channel the command was ran in.
            if (!punishmentChannel) {
                punishmentChannel = interaction.channel as TextChannel;
                interaction.editReply({
                    content: `${emojis.alert}, the punishment channel was either not defined or does not exist. Please contact your server administrator to fix the configuration.`,
                });
            }

            //? sends messages to channel and staff member
            try {
                await punishmentChannel.send({ embeds: [embed], files: [embedFooter] });
                await staffMember.send({ embeds: [embed], components: [row], files: [embedFooter] });
                await interaction.editReply({
                    content: `${emojis.check} **Successfully** sent the punishment.`,
                });
            } catch (error) {
                return interaction.reply({
                    content: `${emojis.alert} I had an issue messaging the user, I have sent the promotion to the logging channel!`,
                    flags: MessageFlags.Ephemeral,
                });
            }

            //? after all messages are sent, the punishment is saved.
            await newPunishment.save();
        } else if (subcommand === "search") {
            //* search subcommand
            // get command data
            const punishmentUser = interaction.options.getUser("punishment-user");

            // reply to the command with fetching message
            await interaction.reply({
                content: `${emojis.search} **Fetching** punishment records...`,
                flags: MessageFlags.Ephemeral,
            });

            //* fetch the punishment
            const userPunishments = await crabPunishment.find({ guildId: guild.id, punishment_staffMember: punishmentUser!.id }).limit(10).sort({ _id: -1 });

            //* define the embeds array
            let embeds = [];

            // check if punishments are there
            if (!userPunishments) {
                //if not then return a message
                return await interaction.editReply({
                    content: `${emojis.x} I could not find any punishments registered to that user.`,
                });
            }

            // * For each userPunishment in userPunishments, make a new embed
            for (const userPunishment of userPunishments) {
                const issuer = await interaction.client.users.fetch(userPunishment.punishment_issuedBy);
                const user = await interaction.client.users.fetch(userPunishment.punishment_staffMember);
                const dateIssued: Date = userPunishment.punishment_date;
                const dateIssuedMS: number = dateIssued.getTime();
                const embed = new EmbedBuilder()
                    .setAuthor({
                        name: `Issued by @${issuer.username}`,
                        iconURL: issuer.displayAvatarURL(),
                    })
                    .setImage("attachment://embed-footer-banner.png")
                    .setTitle("Departmental Punishment")
                    .setColor(0xec3935)
                    .setDescription(`A departmental punishment has been issued to ${user}. Details have been provided by the issuing supervisor below.`)
                    .addFields(
                        {
                            name: "Punishment Type",
                            value: `${userPunishment.punishment_type}`,
                        },
                        {
                            name: "Punishment Reason",
                            value: `${userPunishment.punishment_reason}`,
                        },
                        {
                            name: "Punishment Notes",
                            value: `${userPunishment.punishment_notes}`,
                        }
                    )
                    .setFooter({
                        text: `Punishment ID: ${userPunishment.punishment_id} || Powered by Crab`,
                    });

                if (dateIssued) {
                    //* if a issuedDate is present, include it.
                    embed.addFields({
                        name: "Punishment Issued:",
                        value: `<t:${Math.floor(dateIssuedMS / 1000)}:D>`,
                    });
                }
                //* push the embed to the array
                embeds.push(embed);
            }
            return interaction.editReply({
                content: `${emojis.check} **Successfully** fetched the records!`,
                embeds: embeds,
                files: [embedFooter]
            });
            // TODO: ADD A DROPDOWN MENU TO SELECT WHICH ONE TO REMOVE (IF ADDING A VOID FEATURE) -- OR -- SHOW ONE RECORD PER PAGE
        } else if (subcommand === "void") {
            // void subcommand
            //? Checks if user has permission to use this command.
            if (!member.roles.cache.hasAny(highCommRoleId, allAccessRoleId)) {
                // if not the user is denied.
                return interaction.reply({
                    content: `${emojis.x}, **@${interaction.user.username}**, you cannot use this command.`,
                });
            }
            // fetches command data
            const punishmentId = interaction.options.getString("punishment-id");

            // begins search and notifies the user
            await interaction.reply({
                content: `${emojis.search} **Fetching** the punishment...`,
            });
            const response = await interaction.fetchReply();

            // finds a new punishment
            const userPunishment = await crabPunishment.findOne({
                guildId: guild.id,
                punishment_id: punishmentId,
            });

            //? checks if the punishment exists.
            if (!userPunishment) {
                // * if not then it returns a message
                return await interaction.editReply({
                    content: `${emojis.x} I was unable to locate a punishment with that id, please double check the ID and try again.`,
                });
            }

            // creates a map for the deletion data.
            const tempId = Math.floor(100000 + Math.random() * 900000).toString();
            punishmentMap.set(tempId, userPunishment);

            // * add buttons
            // prettier-ignore
            const confirmDelete = new ButtonBuilder()
            .setCustomId(`crab_button-confirm_delete:${response.id}:${interaction.user.id}:${tempId}`)
            .setEmoji(emojis.check)
            .setLabel("Confirm Delete")
            .setStyle(ButtonStyle.Danger);
            // prettier-ignore
            const cancelDelete = new ButtonBuilder()
            .setCustomId(`crab_button-cancel_delete:${response.id}:${interaction.user.id}`)
            .setEmoji(emojis.x)
            .setLabel("Cancel Delete")
            .setStyle(ButtonStyle.Secondary);

            //? define confirmation row
            const confirmationRow = new ActionRowBuilder<ButtonBuilder>().addComponents(confirmDelete, cancelDelete);
            await interaction.editReply({
                content: `${emojis.check} I was able to locate a punishment with this id string, would you like to proceed and void the report?\n-# This action is **irreversible**.`,
                components: [confirmationRow],
            });
        }
    },
    punishmentMap,
};
