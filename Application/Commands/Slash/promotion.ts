import {
    SlashCommandBuilder,
    InteractionCallback,
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    MessageFlags,
    inlineCode,
    Message,
    ChatInputCommandInteraction,
    Client,
    GuildMember,
    User,
    TextChannel,
    AttachmentBuilder,
} from "discord.js";
import crabPromotion from "../../Models/crab-promotion";
import crabConfig from "../../Models/crab-config";
import { generateDatabaseIdString } from "../../Functions/randomId";
import * as emojis from "../../../emojis.json";
export default {
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
                        .setDescription(
                            "The new role the staff member is recieving."
                        )
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
    execute: async (interaction: ChatInputCommandInteraction,client: Client) => {
        const subcommand = interaction.options.getSubcommand();
        //? Global checks
        const member = interaction.member as GuildMember;
        const guild = interaction.guild;

        if (!member || !guild || !interaction.user || !interaction.channel)
            return;

        //? Generate promotion ID
        const promotionId = `promotion_${generateDatabaseIdString()}`;

        //? Define the attachment
        const embedFooter = new AttachmentBuilder("Images/footer-banner.png", {
            name: "embed-footer-banner.png",
        });

        //? Find guild configuration
        const guildConfig = await crabConfig.findOne({
            guildId: interaction.guild.id,
        });

        //? Define each role ID
        const supervisorRoleId: string = guildConfig!.perms_SupervisorRole;
        const highCommRoleId: string = guildConfig!.perms_HiCommRole;
        const allAccessRoleId: string = guildConfig!.perms_AllAccessRole;

        //? Check if the guild has configured the permissions.
        if (!supervisorRoleId || !highCommRoleId || !allAccessRoleId) {
            return interaction.reply(
                `${emojis.x}, I cannot perform this action. You need to assign permission roles.`
            );
        }

        //? Checks if user has any role requried.
        if (
            member.roles.cache.hasAny(
                supervisorRoleId,
                highCommRoleId,
                allAccessRoleId
            )
        ) {
            //* If not returns and error
            return interaction.reply({
                content: `${emojis.x} **Insufficient** permissions.`,
                flags: MessageFlags.Ephemeral,
            });
        }
        if (subcommand === "issue") {
            //* Issue subcommand
            //? Gets all information from the command.
            const user = interaction.options.getUser("staff-member") as User;
            const newRole = interaction.options.getRole("new-role");
            const notes =
                interaction.options.getString("punishment-notes") ||
                "No additional notes were provided.";

            //? Ensures the user is not attempting to promote themselves. Also checks to see if they are attempting to promote a bot.
            if (user!.id === interaction.user.id) {
                return interaction.reply({
                    content: `${emojis.x} You cannot promote yourself.`,
                    flags: MessageFlags.Ephemeral,
                });
            }
            if (user!.bot) {
                return interaction.reply({
                    content: `${emojis.x} You cannot promote a bot.`,
                    flags: MessageFlags.Ephemeral,
                });
            }
            //? Creates new promotion log.
            //* Does not save the promotion to the DB yet.
            const newPromotion = new crabPromotion({
                guildId: interaction.guild.id,
                promotion_issuedBy: interaction.user.id,
                promotion_staffMember: user!.id,
                promotion_newRoleId: newRole!.id,
                promotion_notes: notes,
                promotion_id: promotionId,
            });

            //? Fetches the role information for the new role.
            const role = interaction.guild.roles.cache.get(newRole!.id);

            //? Checks if the role exists.
            if (!role) {
                //* If not it will retur an error.
                return interaction.reply({
                    content: `${emojis.x}, please select an existing role.`,
                });
            }

            //? Creates embed
            const embed = new EmbedBuilder()
                .setAuthor({
                    name: `Issued by @${interaction.user.username}`,
                    iconURL: interaction.user.displayAvatarURL(),
                })
                .setTitle("Departmental Promotion")
                .setImage("attachment://embed-footer-banner.png")
                .setColor(0x2a9d8f)
                .setDescription(
                    `A departmental promotion has been issued to ${user}. Details have been provided by the issuing supervisor below.`
                )
                .addFields(
                    {
                        name: "New Rank:",
                        value: `@${role.name}`,
                    },
                    {
                        name: "Promotion Notes:",
                        value: `${notes}`,
                    }
                )
                .setFooter({
                    text: `Promotion ID: ${promotionId} || Powered by Crab`,
                })
                .setTimestamp();

            //? Makes the server info button (disabled)
            const serverButton = new ButtonBuilder()
                .setCustomId("crab-button_server-name-disabled")
                .setDisabled(true)
                .setStyle(ButtonStyle.Secondary)
                .setLabel(`Sent from ${interaction.guild.name}`);
            //? Creates the action row
            const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
                serverButton
            );
            //? Fetches the promotion channel
            const promotionChannelId = guildConfig!.promote_Logs;
            let promotionChannel = (await interaction.guild.channels.fetch(promotionChannelId)) as TextChannel;
            //? Fetch the staff member object
            const staffMember = await client.users.fetch(user);

            //? If the promotion channel does not exist, it will set the channel to be the channel the command was ran in.
            //? And will then notify there is no channel
            if (!promotionChannel) {
                promotionChannel = interaction.channel as TextChannel;
                interaction.reply({
                    content: `${emojis.alert}, the promotion channel was either not defined or does not exist. Please contact your server administrator to fix the configuration.`,
                    flags: MessageFlags.Ephemeral,
                });
            }

            try {
                await staffMember.send({ embeds: [embed], components: [row], files: [embedFooter] });
                await promotionChannel.send({ embeds: [embed], files: [embedFooter] });
                await newPromotion.save()
                return interaction.reply({
                    content: `${emojis.check} **Successfully** sent the promotion!`,
                    flags: MessageFlags.Ephemeral,
                });
            } catch (error) {
                return interaction.reply({
                    content: `${emojis.alert} I had an issue messaging the user, I have sent the promotion to the logging channel!`,
                    flags: MessageFlags.Ephemeral,
                });
            }
        }
    },
};
