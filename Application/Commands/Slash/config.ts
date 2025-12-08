import {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ActionRowBuilder,
    MessageFlags,
    inlineCode,
    ChatInputCommandInteraction,
    AttachmentBuilder,
} from "discord.js";
import crabConfig from "../../Models/crab-config";
import * as emojis from "../../../emojis.json";

export default {
    data: new SlashCommandBuilder()
        .setName("config")
        .setDescription("Configure Crab's behavior for your server.")
        .setDefaultMemberPermissions(PermissionFlagsBits.ManageGuild),
    execute: async (interaction: ChatInputCommandInteraction) => {
        //? Guild null check
        const guild = interaction.guild;
        if (!guild) return;

        //? Configuration
        const guildConfig = await crabConfig.findOne({ guildId: guild.id });
        const guildPrefix = guildConfig?.crab_Prefix ?? "-";
        let departmentType = guildConfig?.crab_DepartmentType;

        //? Embed footer banner attachment initialization
        const embedFooter = new AttachmentBuilder("Images/footer-banner.png", {
            name: "embed-footer-banner.png",
        });
        //? Embed Master
        const embed = new EmbedBuilder()
            .setColor(0xec3935)
            .setTitle("Configure Crab")
            .setImage("attachment://embed-footer-banner.png");

        //? Defined the select menu obj
        const selectMenu = new StringSelectMenuBuilder();
        if (!guildConfig || !departmentType) {
            embed.setDescription(
                `**Crab** is an easy to use management bot for your department! We allow our users to easily customize **Crab** to ensure the most flexibility with all situations!\n
                To begin, you will need to set the type of department you are using **Crab** for:\n
                - **Configure Department Type**: Select one of the options (Law Enforcement, Fire and Medical, or Department of Transportation.)\n
                -# You can change the department type in the next step if needed.`
            );
            selectMenu
                .setCustomId("crab-sm_department-selection")
                .setPlaceholder("Configure Department Types")
                .addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setEmoji(emojis.officer)
                        .setLabel("Law Enforcement")
                        .setValue("crab-sm_le"),
                    new StringSelectMenuOptionBuilder()
                        .setEmoji(emojis.fire_truck)
                        .setLabel("Fire and Medical")
                        .setValue("crab-sm_fd-med"),
                    new StringSelectMenuOptionBuilder()
                        .setEmoji(emojis.traffic_light)
                        .setLabel("Department of Transportation")
                        .setValue("crab-sm_dot")
                );
        } else {
            if (departmentType === "leo") {
                embed.setDescription(
                    `You have selected the **Law Enforcement** department type.\n\n
                        Now, you will configure the modules for the **Law Enforcement** commands. The **Law Enforcement** type will allow the following modules to be used:\n
                        * **${
                            emojis.lock_pass
                        } Configure Permissions**\n  * Specifiy your department personnel access roles.\n
                        * **${
                            emojis.message
                        } Configure Prefix**\n  * Change Crab"s prefix from the default ${inlineCode(
                        "-"
                    )}.\n  * Your current prefix is ${inlineCode(guildPrefix)}\n
                        * **${
                            emojis.clock
                        } Shift Logging**\n  * Easily log your department personnel's shifts with our shift logging system!\n
                        * **${
                            emojis.clipboard
                        } Record Management**\n  * Seamlessly record your arrests, citations, and traffic warnings using our record management system.
                        * **${
                            emojis.flag
                        } Reports**\n  * Easily log your reports like: accident reports, scene reports, warrants, and more!\n
                        * **${
                            emojis.trending_up
                        } Promotions, Demotions, and Infractions**\n  * Easily promote, demote, or infract your department personnel with our customizable staff management system!\n
                        * **${
                            emojis.repeat
                        } Change Module**\n  * Switch the module from **Law Enforcement** to **Fire and Medical** or **Department of Transportation** easily!`
                );

                selectMenu
                    .setCustomId("crab-sm_le-plugins")
                    .setPlaceholder("Configure Law Enforcement Plugins")
                    .setOptions(
                        new StringSelectMenuOptionBuilder()
                            .setEmoji(emojis.lock_pass)
                            .setLabel("Configure Permissions")
                            .setValue("crab-sm_perms"),
                        new StringSelectMenuOptionBuilder()
                            .setEmoji(emojis.message)
                            .setLabel("Configure Prefix")
                            .setValue("crab-sm_prefix"),
                        new StringSelectMenuOptionBuilder()
                            .setEmoji(emojis.clock)
                            .setLabel("Shift Logging")
                            .setValue("crab-sm_shifts"),
                        new StringSelectMenuOptionBuilder()
                            .setEmoji(emojis.clipboard)
                            .setLabel("Record Management")
                            .setValue("crab-sm_records"),
                        new StringSelectMenuOptionBuilder()
                            .setEmoji(emojis.flag)
                            .setLabel("Reports")
                            .setValue("crab-sm_reports"),
                        new StringSelectMenuOptionBuilder()
                            .setEmoji(emojis.trending_up)
                            .setLabel("Promotions, Infractions, and Demotions")
                            .setValue("crab-sm_staff"),
                        new StringSelectMenuOptionBuilder()
                            .setEmoji(emojis.repeat)
                            .setLabel("Change Module")
                            .setValue("crab-sm_change")
                    );
            } else if (departmentType === "fd-med") {
                embed.setDescription(
                    `You have selected the **Fire and Medical** department type.\n\n
                        Now, you will configure the modules for the **Fire and Medical** commands. The **Fire and Medical** type will allow the following modules to be used:\n
                        * **${
                            emojis.lock_pass
                        } Configure Permissions**\n  * Specifiy your department personnel access roles.\n
                        * **${
                            emojis.message
                        } Configure Prefix**\n  * Change Crab's prefix from the default ${inlineCode(
                        "-"
                    )}.\n  * Your current prefix is ${inlineCode(guildPrefix)}\n
                        * **${
                            emojis.clock
                        } Shift Logging**\n  * Easily log your department personnel's shifts with our shift logging system!\n
                        * **${
                            emojis.flag
                        } Reports**\n  * Easily log your reports like: accident reports, scene reports, warrants, and more!\n
                        * **${
                            emojis.trending_up
                        } Promotions, Demotions, and Infractions**\n  * Easily promote, demote, or infract your department personnel with our customizable staff management system!\n
                        * **${
                            emojis.repeat
                        } Change Module**\n  * Switch the module from **Fire and Medical** to **Law Enforcement** or **Department of Transportation** easily!`
                );

                selectMenu
                    .setCustomId("crab-sm_fd-med-plugins")
                    .setPlaceholder("Configure Fire and Medical Plugins")
                    .setOptions(
                        new StringSelectMenuOptionBuilder()
                            .setEmoji(emojis.lock_pass)
                            .setLabel("Configure Permissions")
                            .setValue("crab-sm_perms"),
                        new StringSelectMenuOptionBuilder()
                            .setEmoji(emojis.message)
                            .setLabel("Configure Prefix")
                            .setValue("crab-sm_prefix"),
                        new StringSelectMenuOptionBuilder()
                            .setEmoji(emojis.clock)
                            .setLabel("Shift Logging")
                            .setValue("crab-sm_shifts"),
                        new StringSelectMenuOptionBuilder()
                            .setEmoji(emojis.flag)
                            .setLabel("Reports")
                            .setValue("crab-sm_reports"),
                        new StringSelectMenuOptionBuilder()
                            .setEmoji(emojis.trending_up)
                            .setLabel("Promotions, Infractions, and Demotions")
                            .setValue("crab-sm_staff"),
                        new StringSelectMenuOptionBuilder()
                            .setEmoji(emojis.repeat)
                            .setLabel("Change Module")
                            .setValue("crab-sm_change")
                    );
            } else if (departmentType === "dot") {
                embed.setDescription(
                    `You have selected the **Department of Transportation** department type.\n\n
                        Now, you will configure the modules for the **Department of Transportation** commands. The **Department of Transportation** type will allow the following modules to be used:\n
                        * **${
                            emojis.lock_pass
                        } Configure Permissions**\n  * Specifiy your department personnel access roles.\n
                        * **${
                            emojis.message
                        } Configure Prefix**\n  * Change Crab's prefix from the default ${inlineCode(
                        "-"
                    )}.\n  * Your current prefix is ${inlineCode(guildPrefix)}\n
                        * **${
                            emojis.clock
                        } Shift Logging**\n  * Easily log your department personnel's shifts with our shift logging system!\n
                        * **${
                            emojis.flag
                        } Reports**\n  * Easily log your reports like: accident reports, scene reports, warrants, and more!\n
                        * **${
                            emojis.trending_up
                        } Promotions, Demotions, and Infractions**\n  * Easily promote, demote, or infract your department personnel with our customizable staff management system!\n
                        * **${
                            emojis.repeat
                        } Change Module**\n  * Switch the module from **Department of Transportation** to **Law Enforcement** or **Fire and Medical** easily!`
                );

                selectMenu
                    .setCustomId("crab-sm_dot-plugins")
                    .setPlaceholder(
                        "Configure Department of Transportation Plugins"
                    )
                    .setOptions(
                        new StringSelectMenuOptionBuilder()
                            .setEmoji(emojis.lock_pass)
                            .setLabel("Configure Permissions")
                            .setValue("crab-sm_perms"),
                        new StringSelectMenuOptionBuilder()
                            .setEmoji(emojis.message)
                            .setLabel("Configure Prefix")
                            .setValue("crab-sm_prefix"),
                        new StringSelectMenuOptionBuilder()
                            .setEmoji(emojis.clock)
                            .setLabel("Shift Logging")
                            .setValue("crab-sm_shifts"),
                        new StringSelectMenuOptionBuilder()
                            .setEmoji(emojis.flag)
                            .setLabel("Reports")
                            .setValue("crab-sm_reports"),
                        new StringSelectMenuOptionBuilder()
                            .setEmoji(emojis.trending_up)
                            .setLabel("Promotions, Infractions, and Demotions")
                            .setValue("crab-sm_staff"),
                        new StringSelectMenuOptionBuilder()
                            .setEmoji(emojis.repeat)
                            .setLabel("Change Module")
                            .setValue("crab-sm_change")
                    );
            }
        }
        const selectMenuRow =
            new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                selectMenu
            );
        interaction.reply({
            embeds: [embed],
            components: [selectMenuRow],
            files: [embedFooter],
            flags: MessageFlags.Ephemeral,
        });
    },
};
