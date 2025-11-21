import { Client, Message } from "discord.js"
import { handleMessageError } from "../Functions/error-handler";
import { guildExclusionCheckMessage, userExclusionCheckMessage } from "../Functions/exclusion-handler";
import crabConfig from "../Models/crab-config";
module.exports = {
  event: "messageCreate",
  once: false,
  execute: async (client: Client, message: Message) => {
    if (message.author.bot || !message.guild) return;
    await guildExclusionCheckMessage(client, message)
    await userExclusionCheckMessage(client, message)
    try {
      const guildConfig = await crabConfig.findOne({
        guildId: message.guild.id,
      });
      const crabPrefix = guildConfig?.crab_Prefix || "-";

      if (!message.content.startsWith(crabPrefix)) return;

      const args = message.content.slice(crabPrefix.length).trim().split(/ +/);
      const commandName = args.shift()!.toLowerCase();

      const command = client.prefixCommands.get(commandName);

      if (!command) return;
      await command.execute(message, args);
    } catch (error) {
      await handleMessageError(client, message, error)
    }
  },
};
