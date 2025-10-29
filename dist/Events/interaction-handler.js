"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = require("discord.js");
// import CrabGuildExclusion = require("../schemas/CrabGuildExclusion");
// const CrabUserExclusion = require("../schemas/CrabUserExclusion");
const error_handler_1 = require("../Functions/error-handler");
module.exports = {
    event: "interactionCreate",
    once: false,
    execute: async (client, interaction) => {
        // const UserExcluded = await CrabUserExclusion.findOne({
        //   crab_UserID: interaction.user.id,
        // });
        // const GuildExluded = await CrabGuildExclusion.findOne({
        //   crab_guildId: interaction.guild.id,
        // });
        // if (GuildExluded) {
        //   interaction.reply(
        //     `${shield} This guild has been excluded from this service, the bot will now leave the guild.`
        //   );
        //   const user = await guild.fetchOwner();
        //   const ExclusionEmbed = new EmbedBuilder()
        //     .setColor(0xec3935)
        //     .setDescription(
        //       "This message is in regards of the recent exclusion from the service of **Crab**.\n\nTo clarify, an exclusion from our service comes very rarely and is only applied if a server has broken our terms of service or violated a major rule. Exclusions are not appealable, but they can be removed if an Executive Board member choses to.\n\nThe details of your exclusion are confidential and secure to only Crab staff members. If you wish to inquiry about the exclusion, please see our [support](https://discord.gg/8XScx8MNfE)."
        //     )
        //     .setFooter({ text: "Crab Legal Affairs Team" })
        //     .setTitle("Crab Exclusion Notice")
        //     .setTimestamp();
        //   const serverButton = new ButtonBuilder()
        //     .setCustomId("crab-button_server-name-disabled")
        //     .setDisabled(true)
        //     .setStyle(ButtonStyle.Secondary)
        //     .setLabel(`Official Notice from Tropical Systems`);
        //   const row = new ActionRowBuilder().addComponents(serverButton);
        //   try {
        //     await user.send({ embeds: [ExclusionEmbed], components: [row] });
        //   } catch (error) {
        //     return;
        //   }
        //   client.guilds.cache.get(interaction.guild.id).leave();
        //   return;
        // } else if (UserExcluded) {
        //   return interaction.reply(
        //     `${shield} You have been excluded from this service and cannot run any commands.`
        //   );
        // }
        try {
            if (interaction.isAutocomplete()) {
                const command = client.slashCommands.get(interaction.commandName);
                if (!command || typeof command.autocomplete !== "function")
                    return;
                await command.autocomplete(interaction);
            }
            if (interaction.isCommand()) {
                const command = client.slashCommands.get(interaction.commandName);
                if (!command) {
                    interaction.reply({
                        content: "This command could not be found!",
                        flags: discord_js_1.MessageFlags.Ephemeral,
                    });
                    return;
                }
                await command.execute(interaction);
            }
            else if (interaction.isButton()) {
                let button = client.buttons.get(interaction.customId);
                if (!button) {
                    button = [...client.buttons.values()].find((b) => interaction.customId.startsWith(b.customId));
                }
                if (!button) {
                    return interaction.reply({
                        content: "This button could not be found!",
                        flags: discord_js_1.MessageFlags.Ephemeral,
                    });
                }
                await button.execute(interaction);
            }
            else if (interaction.isAnySelectMenu()) {
                const selectMenu = client.selectMenus.get(interaction.values[0]) ||
                    client.selectMenus.get(interaction.customId);
                if (!selectMenu) {
                    interaction.reply({
                        content: "This select menu could not be found!",
                        flags: discord_js_1.MessageFlags.Ephemeral,
                    });
                    return;
                }
                await selectMenu.execute(interaction);
            }
            else if (interaction.isModalSubmit()) {
                const modal = client.modals.get(interaction.customId);
                if (!modal) {
                    interaction.reply({
                        content: "This modal could not be found!",
                        flags: discord_js_1.MessageFlags.Ephemeral,
                    });
                    return;
                }
                await modal.execute(interaction);
            }
            else
                return;
        }
        catch (error) {
            await (0, error_handler_1.handleInteractionError)(client, interaction, error);
        }
    },
};
