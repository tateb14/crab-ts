import { EmbedBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, ActionRowBuilder, inlineCode, ButtonInteraction, GuildMember, MessageFlags } from "discord.js";
import crabConfig from "../../Models/crab-config";
import * as emojis from "../../../emojis.json";

export default {
    customId: "crab-button_back",
    execute: async (interaction: ButtonInteraction) => {
        //? Global checks
        const member = interaction.member as GuildMember;
        const guild = interaction.guild;
        const user = interaction.user;
        if (!member || !guild || !user) return;
        const guildConfig = await crabConfig.findOne({ guildId: interaction.guild.id });

        // ! Check guild config
        if (!guildConfig) {
            return interaction.reply({ content: `**@${user.username}**, no guild configuration was found. Please contact Tropical Systems.`, flags: MessageFlags.Ephemeral });
        }
        const departmentType = guildConfig.crab_DepartmentType;
        const embed = interaction.message.embeds[0];
        const guildPrefix = guildConfig.crab_Prefix;

        const row = new ActionRowBuilder<StringSelectMenuBuilder>();
        let selectMenu = new StringSelectMenuBuilder();
        const configEmbed = EmbedBuilder.from(embed);
        if (departmentType === "leo") {
            configEmbed.setDescription(`You have selected the **Law Enforcement** department type.\n\nNow, you will configure the modules for the **Law Enforcement** commands. The **Law Enforcement** type will allow the following modules to be used:\n* **${emojis.lock_pass} Configure Permissions**\n  * Specifiy your department personnel access roles.\n* **${emojis.message} Configure Prefix**\n  * Change Crab"s prefix from the default ${inlineCode("-")}.\n  * Your current prefix is ${inlineCode(guildPrefix)}\n* **${emojis.lock_pass} Shift Logging**\n  * Easily log your department personnel"s shifts with our shift logging system!\n* ** ${emojis.clipboard} Record Management**\n  * Seamlessly record your arrests, citations, and traffic warnings using our record management system.\n* **${emojis.flag} Reports**\n  * Easily log your reports like: accident reports, scene reports, warrants, and more!\n* **${emojis.trending_up} Promotions, Demotions, and Infractions**\n  * Easily promote, demote, or infract your department personnel with our customizable staff management system!\n* **${emojis.repeat} Change Module**\n  * Switch the module from **Law Enforcement** to **Fire and Medical** or **Department of Transportation** easily!`);
            selectMenu.setCustomId("crab-sm_le-plugins").setPlaceholder("Configure Law Enforcement Plugins").setOptions(new StringSelectMenuOptionBuilder().setEmoji(emojis.lock_pass).setLabel("Configure Permissions").setValue("crab-sm_perms"), new StringSelectMenuOptionBuilder().setEmoji(emojis.message).setLabel("Configure Prefix").setValue("crab-sm_prefix"), new StringSelectMenuOptionBuilder().setEmoji(emojis.clock).setLabel("Shift Logging").setValue("crab-sm_shifts"), new StringSelectMenuOptionBuilder().setEmoji(emojis.clipboard).setLabel("Record Management").setValue("crab-sm_records"), new StringSelectMenuOptionBuilder().setEmoji(emojis.flag).setLabel("Reports").setValue("crab-sm_reports"), new StringSelectMenuOptionBuilder().setEmoji(emojis.trending_up).setLabel("Promotions, Infractions, and Demotions").setValue("crab-sm_staff"), new StringSelectMenuOptionBuilder().setEmoji(emojis.repeat).setLabel("Change Module").setValue("crab-sm_change"));
        } else if (departmentType === "fd-med") {
            configEmbed.setDescription(`You have selected the **Fire and Medical** department type.\n\nNow, you will configure the modules for the **Law Enforcement** commands. The **Law Enforcement** type will allow the following modules to be used:\n* **${emojis.lock_pass} Configure Permissions**\n  * Specifiy your department personnel access roles.\n* **${emojis.message} Configure Prefix**\n  * Change Crab"s prefix from the default ${inlineCode("-")}.\n  * Your current prefix is ${inlineCode(guildPrefix)}\n* **${emojis.clock} Shift Logging**\n  * Easily log your department personnel"s shifts with our shift logging system!\n* **${emojis.flag} Reports**\n  * Easily log your reports like: accident reports, scene reports, warrants, and more!\n* **${emojis.trending_up} Promotions, Demotions, and Infractions**\n  * Easily promote, demote, or infract your department personnel with our customizable staff management system!\n* **${emojis.repeat} Change Module**\n  * Switch the module from **Law Enforcement** to **Law Enforcement** or **Department of Transportation** easily!`);
            selectMenu.setCustomId("crab-sm_fd-med-plugins").setPlaceholder("Configure Fire and Medical Plugins").setOptions(new StringSelectMenuOptionBuilder().setEmoji(emojis.lock_pass).setLabel("Configure Permissions").setValue("crab-sm_perms"), new StringSelectMenuOptionBuilder().setEmoji(emojis.message).setLabel("Configure Prefix").setValue("crab-sm_prefix"), new StringSelectMenuOptionBuilder().setEmoji(emojis.clock).setLabel("Shift Logging").setValue("crab-sm_shifts"), new StringSelectMenuOptionBuilder().setEmoji(emojis.flag).setLabel("Reports").setValue("crab-sm_reports"), new StringSelectMenuOptionBuilder().setEmoji(emojis.trending_up).setLabel("Promotions, Infractions, and Demotions").setValue("crab-sm_staff"), new StringSelectMenuOptionBuilder().setEmoji(emojis.repeat).setLabel("Change Module").setValue("crab-sm_change"));
        } else if (departmentType === "dot") {
            configEmbed.setDescription(`You have selected the **Department of Transportation** department type.\n\nNow, you will configure the modules for the **Law Enforcement** commands. The **Law Enforcement** type will allow the following modules to be used:\n* **${emojis.lock_pass} Configure Permissions**\n  * Specifiy your department personnel access roles.\n* **${emojis.message} Configure Prefix**\n  * Change Crab"s prefix from the default ${inlineCode("-")}.\n  * Your current prefix is ${inlineCode(guildPrefix)}\n* **${emojis.clock} Shift Logging**\n  * Easily log your department personnel"s shifts with our shift logging system!\n* **${emojis.flag} Reports**\n  * Easily log your reports like: accident reports, scene reports, warrants, and more!\n* **${emojis.trending_up} Promotions, Demotions, and Infractions**\n  * Easily promote, demote, or infract your department personnel with our customizable staff management system!\n* **${emojis.repeat} Change Module**\n  * Switch the module from **Department of Transportation** to **Fire and Medical** or **Law Enforcement** easily!`);
            selectMenu.setCustomId("crab-sm_dot-plugins").setPlaceholder("Configure Department of Transportation Plugins").setOptions(new StringSelectMenuOptionBuilder().setEmoji(emojis.lock_pass).setLabel("Configure Permissions").setValue("crab-sm_perms"), new StringSelectMenuOptionBuilder().setEmoji(emojis.message).setLabel("Configure Prefix").setValue("crab-sm_prefix"), new StringSelectMenuOptionBuilder().setEmoji(emojis.clock).setLabel("Shift Logging").setValue("crab-sm_shifts"), new StringSelectMenuOptionBuilder().setEmoji(emojis.flag).setLabel("Reports").setValue("crab-sm_reports"), new StringSelectMenuOptionBuilder().setEmoji(emojis.trending_up).setLabel("Promotions, Infractions, and Demotions").setValue("crab-sm_staff"), new StringSelectMenuOptionBuilder().setEmoji(emojis.repeat).setLabel("Change Module").setValue("crab-sm_change"));
        }
        row.addComponents(selectMenu);
    },
};
