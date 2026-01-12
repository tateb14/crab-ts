import { Interaction, Message, MessageFlags, MessageEditOptions, InteractionReplyOptions } from "discord.js";

type EditPayload = MessageEditOptions & InteractionReplyOptions;

export default async function safeEdit(
  interaction: Interaction,
  message: Message | null | undefined,
  payload: EditPayload
) {
  try {
    // Try to edit the message directly if it exists
    if (message) {
      try {
        await message.edit(payload);
        return;
      } catch (err: any) {
        // 10008 = Unknown Message (message was deleted)
        if (err.code !== 10008) throw err;
        console.warn("[safeEdit] Message no longer exists, falling back to interaction.");
      }
    }

    // Fall back to interaction-based editing
    if (!interaction.isRepliable()) {
      console.warn("[safeEdit] Interaction is not repliable");
      return;
    }

    if (interaction.deferred || interaction.replied) {
      await interaction.editReply(payload);
    } else if (interaction.isMessageComponent()) {
      await interaction.update(payload);
    } else {
      await interaction.reply({ ...payload, flags: MessageFlags.Ephemeral });
    }
  } catch (err) {
    console.error("[safeEdit Error]", err);
    
    // Try to send an error message if we haven't replied yet
    if (interaction.isRepliable() && !interaction.replied && !interaction.deferred) {
      await interaction
        .reply({
          content: "⚠️ Something went wrong while editing the message.",
          flags: MessageFlags.Ephemeral,
        })
        .catch(() => {});
    }
  }
}
