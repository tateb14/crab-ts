import { Client, MessageFlags } from "discord.js";
import { handleInteractionError } from "../Functions/error-handler";
import {
    guildExclusionCheckInteraction,
    userExclusionCheckInteraction,
} from "../Functions/exclusion-handler";
import { x } from "../../emojis.json";
export default {
    event: "interactionCreate",
    once: false,
    execute: async (client: Client, interaction: any) => {
        await guildExclusionCheckInteraction(client, interaction);
        await userExclusionCheckInteraction(client, interaction);
        try {
            switch (true) {
                case interaction.isAutocomplete():
                    const autocompleteCommand = client.slashCommands.get(
                        interaction.commandName
                    );
                    if (
                        !autocompleteCommand ||
                        typeof autocompleteCommand.autocomplete !== "function"
                    )
                        return;

                    await autocompleteCommand.autocomplete(interaction);
                    break;
                case interaction.isCommand():
                    const slashCommand = client.slashCommands.get(
                        interaction.commandName
                    );
                    if (!slashCommand) {
                        interaction.reply({
                            content: `${x} I could not find this command, please contact Tropical Systems.`,
                            flags: MessageFlags.Ephemeral,
                        });
                        return;
                    }
                    await slashCommand.execute(interaction, client);
                    break;
                case interaction.isButton():
                    let button = client.buttons.get(interaction.customId);
                    if (!button) {
                        button = [...client.buttons.values()].find((b) =>
                            interaction.customId.startsWith(b.customId)
                        );
                    }
                    if (!button) {
                        return interaction.reply({
                            content: `${x} I could not find this button, please contact Tropical Systems.`,
                            flags: MessageFlags.Ephemeral,
                        });
                    }
                    await button.execute(interaction);
                    break;
                case interaction.isAnySelectMenu():
                    let selectMenu =
                        client.selectMenus.get(interaction.values[0]) ||
                        client.selectMenus.get(interaction.customId);
                    if (!selectMenu) {
                        selectMenu = [...client.selectMenus.values()].find(
                            (sm) => interaction.customId.startsWith(sm.customId)
                        );
                    }
                    if (!selectMenu) {
                        interaction.reply({
                            content: `${x} I could not find this select menu, please contact Tropical Systems.`,
                            flags: MessageFlags.Ephemeral,
                        });
                        return;
                    }
                    await selectMenu.execute(interaction);
                    break;
                case interaction.isModalSubmit():
                    let modal = client.modals.get(interaction.customId);
                    if (!modal) {
                        modal = [...client.modals.values()].find((m) =>
                            interaction.customId.startsWith(m.customId)
                        );
                    }
                    if (!modal) {
                        interaction.reply({
                            content: `${x} I could not find this modal, please contact Tropical Systems.`,
                            flags: MessageFlags.Ephemeral,
                        });
                        return;
                    }
                    await modal.execute(interaction);
                    break;
                default:
                    return;
            }
        } catch (error) {
            await handleInteractionError(client, interaction, error);
        }
    },
};
