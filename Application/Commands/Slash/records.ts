import { SlashCommandBuilder, EmbedBuilder, MessageFlags, ButtonBuilder, ButtonStyle, ActionRowBuilder, inlineCode, ChatInputCommandInteraction, Client, GuildMember, AutocompleteInteraction, AttachmentBuilder, TextChannel, Message } from "discord.js";
import crabConfig from "../../Models/crab-config";
import guildRecord from "../../Models/guild-record";
import { generateDatabaseIdString } from "../../Functions/randomId";
import { emojis } from '../../config';
import searchRobloxUsers from "../../Functions/search-roblox-username";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("record")
        .setDescription("..")
        .addSubcommand((subcommand) =>
            subcommand
                .setName("create")
                .setDescription("Create a police record and broadcast it to on duty officers.")
                .addStringOption((option) => option.setName("record-type").setDescription("The type of record you are creating.").setRequired(true).addChoices({ name: "Vehicle BOLO", value: "Vehicle BOLO" }, { name: "Suspect BOLO", value: "Suspect BOLO" }, { name: "Arrest Warrant", value: "Arrest Warrant" }, { name: "Search Warrant", value: "Search Warrant" }, { name: "Arrest Record", value: "Arrest Record" }, { name: "Citation Record", value: "Citation Record" }))
                .addStringOption((option) => option.setName("suspect-username").setDescription("The username of the suspect you are issuing the report on.").setRequired(true).setAutocomplete(true))
                .addStringOption((option) => option.setName("charges").setDescription("List the charges on the suspect.").setRequired(true))
                .addStringOption((option) => option.setName("armed").setDescription("Is the suspect armed?").setRequired(false).addChoices({ name: "Yes", value: emojis.check }, { name: "No", value: emojis.x }))
                .addStringOption((option) => option.setName("dangerous").setDescription("Is the suspect dangerous?").setRequired(false).addChoices({ name: "Yes", value: emojis.check }, { name: "No", value: emojis.x }))
                .addStringOption((option) => option.setName("mentally-ill").setDescription("Is the suspect mentally ill?").setRequired(false).addChoices({ name: "Yes", value: emojis.check }, { name: "No", value: emojis.x }))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("search")
                .setDescription("Search the database for records.")
                .addStringOption((option) => option.setName("suspect-username").setDescription("The username of the suspect you are performing the search on.").setRequired(true).setAutocomplete(true))
        )
        .addSubcommand((subcommand) =>
            subcommand
                .setName("void")
                .setDescription("Delete a record from the database.")
                .addStringOption((option) => option.setName("record-id").setDescription("The identifcation of the record you wish to delete.").setRequired(true))
        ),
    execute: async (interaction: ChatInputCommandInteraction, client: Client) => {
        const subcommand = interaction.options.getSubcommand();
        // ? global checks
        const guild = interaction.guild;
        const member = interaction.member as GuildMember;
        const user = interaction.user;
        if (!guild || !member || !user) return;

        //? Embed footer banner attachment initialization
        const embedFooter = new AttachmentBuilder("Images/footer-banner.png", {
            name: "embed-footer-banner.png",
        });
        //? fetch the guild's config
        const guildConfig = await crabConfig.findOne({ guildId: guild.id });
        //? get the permission roles
        const personnelRoleId = guildConfig!.perms_PersonnelRole;
        const supervisorRoleId = guildConfig!.perms_SupervisorRole;
        const highCommRoleId = guildConfig!.perms_HiCommRole;
        const allAccessRoleId = guildConfig!.perms_AllAccessRole;
        //? generate a recordId
        const recordId = `record_${generateDatabaseIdString()}`;

        //? check if the server has defined all perm roles
        if (!personnelRoleId || !supervisorRoleId || !highCommRoleId || !allAccessRoleId) {
            return interaction.reply({ content: `${emojis.x}, **@${interaction.user.username}**, this server has not setup all permission roles.`, flags: MessageFlags.Ephemeral });
        }
        //? check if the user has any permission roles which are required
        if (!member.roles.cache.hasAny(personnelRoleId, supervisorRoleId, highCommRoleId, allAccessRoleId)) {
            return interaction.reply({ content: `${emojis.x}, **@${interaction.user.username}**, you cannot use this command.`, flags: MessageFlags.Ephemeral });
        }

        if (subcommand === "create") {
            // * define all command variables
            let response
            // * subcommand to create a record
            const recordType = interaction.options.getString("record-type");
            const suspectUsername = interaction.options.getString("suspect-username");
            const charges = interaction.options.getString("charges");
            const armedFlag = interaction.options.getString("armed") || emojis.x;
            const dangerousFlag = interaction.options.getString("dangerous") || emojis.x;
            const mentallyIllFlag = interaction.options.getString("mentally-ill") || emojis.x;
            //? Interaction reply pending
            await interaction.reply(`${emojis.search} **Processing** you record...`);
            //? Embed
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: `Record created by @${user.username}`,
                    iconURL: user.displayAvatarURL(),
                })
                .setColor(0xec3935)
                .setImage("attachment://embed-footer-banner.png")
                .setDescription(`A new record has been created, you can view the details below.`)
                .addFields(
                    {
                        name: "Recort Type:",
                        value: `${recordType}`,
                        inline: true,
                    },
                    {
                        name: "Suspect Username:",
                        value: `${suspectUsername}`,
                        inline: true,
                    },
                    {
                        name: "Suspect Flags:",
                        value: `**Armed?** ${armedFlag}\n**Dangerous?** ${dangerousFlag}\n**Mentally Ill?** ${mentallyIllFlag}`,
                        inline: true,
                    },
                    { name: "Suspect Charges:", value: `${charges}`, inline: false }
                )
                .setFooter({ text: `Record ID: ${recordId} || Powered by Crab` });
            //? Record Channel
            const recordChannelId = guildConfig!.records_Logs;
            let recordChannel = (await interaction.guild.channels.fetch(recordChannelId)) as TextChannel;
            // ? Check if record channel exisits, if not then change to the interacion channel
            if (!recordChannel) {
                recordChannel = interaction.channel as TextChannel;
                interaction.followUp({
                    content: `${emojis.alert}, the records channel was either not defined or does not exist. Please contact your server administrator to fix the configuration.`,
                    flags: MessageFlags.Ephemeral,
                });
            }

            const newRecord = new guildRecord({
                guildId: guild,
                suspectFlags: `Armed? **${armedFlag}**, Dangerous? **${dangerousFlag}**, Mentally Ill? **${mentallyIllFlag}**`,
                suspectUsername: suspectUsername,
                charges: charges,
                issuedBy: interaction.user.id,
                recordType: recordType,
                reviewedBy: null,
                dateIssued: Date.now(),
                messageId: response!.id,
                id: recordId,
            });
            if (recordType !== "Vehicle BOLO" && recordType !== "Suspect BOLO") {
                const approveButton = new ButtonBuilder().setCustomId("crab-button_record-approve").setLabel("Approve Record").setStyle(ButtonStyle.Success).setEmoji(emojis.check);
                const denyButton = new ButtonBuilder().setCustomId("crab-button_record-deny").setLabel("Deny Record").setStyle(ButtonStyle.Danger).setEmoji(emojis.x);
                const row = new ActionRowBuilder<ButtonBuilder>().addComponents(approveButton, denyButton);
                response = await recordChannel.send({
                    embeds: [embed],
                    components: [row],
                    files: [embedFooter],
                    content: `<@&${supervisorRoleId}>, a new record has been submitted.`,
                });
                await newRecord.save();
                await interaction.editReply({
                    content: "**Successfully** sent your record and it is pending approval. You will be messaged when it is approved or denied.",
                });
            } else {
                response = await recordChannel.send({
                    embeds: [embed],
                    files: [embedFooter],
                    content: `A new record has been submitted.`,
                });
                await newRecord.save();
                await interaction.reply({
                    content: "**Successfully** sent your record!",
                    flags: MessageFlags.Ephemeral,
                });
            }
        } else if (subcommand === "search") {
            // * fetch suspect username
            const suspectUsername = interaction.options.getString("suspect-username");
            const suspectRecords = await guildRecord.find({
                guildId: guild.id,
                suspectUsername: suspectUsername,
            }).sort({ _id: -1 }).limit(10);
            if (!suspectRecords || suspectRecords.length === 0) {
                return interaction.reply({
                    content: `${emojis.x} No record was found under that suspect's username.`,
                    flags: MessageFlags.Ephemeral,
                });
            } else {
                let recordEmbeds = [];
                for (const record of suspectRecords) {
                    const issuedDate = Math.floor(Number(record.dateIssued) / 1000);
                    const reviewedBy = record.reviewedBy || "Not yet reviewed.";
                    const recordEmbed = new EmbedBuilder()
                        .setColor(0xec3935)
                        .setTitle(`Record Search Results`)
                        .setImage("https://cdn.discordapp.com/attachments/1265767289924354111/1409647765188907291/CrabBanner-EmbedFooter-RedBG.png?ex=68ae2449&is=68acd2c9&hm=643546e45cccda97a49ab46b06c08471d89efbd76f2043d57d0db22cf5a1f657&")
                        .setDescription(`A record created by <@${record.issuedBy}>, the suspect's username is **${record.suspectUsername}**. You can find details below.`)
                        .addFields(
                            {
                                name: "Suspect Charges:",
                                value: `${record.charges}`,
                                inline: true,
                            },
                            {
                                name: "Record Type:",
                                value: `${record.recordType}`,
                                inline: true,
                            },
                            {
                                name: "Suspect Flags:",
                                value: `${record.suspectFlags}`,
                                inline: true,
                            },
                            {
                                name: "Date Issued",
                                value: `<t:${issuedDate}:D>`,
                                inline: true,
                            },
                            {
                                name: "Reviewed By:",
                                value: `<@${reviewedBy}>`,
                                inline: true,
                            }
                        )
                        .setFooter({ text: `Record ID: ${record.id} || Powered by Crab` });
                    recordEmbeds.push(recordEmbed);
                }
                await interaction.reply({ embeds: recordEmbeds });
            }
        } else if (subcommand === "void") {
            // * Check user has perm roles
            if (!member.roles.cache.hasAny(highCommRoleId, allAccessRoleId)) {
                return interaction.reply({ content: `${emojis.x}, **@${interaction.user.username}**, you cannot use this command.`, flags: MessageFlags.Ephemeral });
            }
            // ? Fetch record ID
            const recordId = interaction.options.getString("record-id");
            // ? Fetch the response and the record
            const response = await interaction.reply({ content: `${emojis.search} **Fetching** the record...` });
            const record = await guildRecord.findOne({ guildId: interaction.guild.id, id: recordId });
            // ? Check the record
            if (!record) {
                return await interaction.editReply({ content: `${emojis.x} I was unable to locate a record with that id, please double check the ID and try again.` });
            }
            // ? Make buttons
            const confirmDelete = new ButtonBuilder().setCustomId(`crab_button-confirm_delete:${response.id}:${interaction.user.id}:${recordId}`).setEmoji(emojis.check).setLabel("Confirm Delete").setStyle(ButtonStyle.Danger);
            const cancelDelete = new ButtonBuilder().setCustomId(`crab_button-cancel_delete:${response.id}:${interaction.user.id}`).setEmoji(emojis.x).setLabel("Cancel Delete").setStyle(ButtonStyle.Secondary);
            // ? Make the row
            const confirmationRow = new ActionRowBuilder<ButtonBuilder>().addComponents(confirmDelete, cancelDelete);
            // ? edit the reply
            await interaction.editReply({ content: `${emojis.check} I was able to locate a record with this id string, would you like to proceed and void the report?\n-# This action is **irreversible**.`, components: [confirmationRow] });
        }
    },
    async autocomplete(interaction: AutocompleteInteraction, client: Client) {
        const MAX_RESULTS = 10;
        const focused = interaction.options.getFocused() as string;
        const results = await searchRobloxUsers(focused);
        await interaction.respond(
            results.map((user: { name: string }) => ({name: user.name, value: user.name,})).slice(0, MAX_RESULTS)
        );
    },
};
