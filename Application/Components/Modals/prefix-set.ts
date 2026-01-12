import { MessageFlags, inlineCode, ModalSubmitInteraction } from "discord.js";
import crabConfig from "../../Models/crab-config";
import * as emojis from "../../../emojis.json"
export default {
    customId: "crab-modal_prefix",
    execute: async (interaction: ModalSubmitInteraction) => {
        const prefix = interaction.fields.getTextInputValue("crab-text_prefix");
        await crabConfig.updateOne({ guildId: interaction.guild!.id }, { $set: { crab_Prefix: prefix } }, { new: true, upsert: true });

        interaction.reply({ content: `${emojis.x} you have configured your guild prefix to ${inlineCode(prefix)}.`, flags: MessageFlags.Ephemeral });
    },
};
