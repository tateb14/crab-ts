// const crabConfig = require("../schemas/CrabConfig");
// const CrabGuildExclusion = require("../schemas/CrabGuildExclusion");
// const CrabUserExclusion = require("../schemas/CrabUserExclusion");
import { Client, Message } from "discord.js"
import { handleMessageError } from "../Functions/error-handler";
module.exports = {
  event: "messageCreate",
  once: false,
  execute: async (client: Client, message: Message) => {
    if (message.author.bot || !message.guild) return;
    // const UserExcluded = await CrabUserExclusion.findOne({
    //   crab_UserID: message.author.id,
    // });
    // const GuildExluded = await CrabGuildExclusion.findOne({
    //   crab_guildId: message.guild.id,
    // });
    // if (GuildExluded) {
    //   message.reply(
    //     `${shield} This guild has been excluded from this service, the bot will now leave the guild.`
    //   );
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
    //   const user = await message.guild.fetchOwner();
    //   try {
    //     await user.send({ embeds: [ExclusionEmbed], components: [row] });
    //   } catch (error) {
    //     return;
    //   }
    //   client.guilds.cache.get(message.guild.id).leave();
    //   return;
    // } else if (UserExcluded) {
    //   return message.reply(
    //     `${shield} You have been excluded from this service and cannot run any commands.`
    //   );
    // }
    try {
      // const guildConfig = await crabConfig.findOne({
      //   guildId: message.guild.id,
      // });
      // const crabPrefix = guildConfig?.crab_Prefix || "-";

      // if (!message.content.startsWith(crabPrefix)) return;

      // const args = message.content.slice(crabPrefix.length).trim().split(/ +/);
      // const commandName = args.shift().toLowerCase();

      // const command = client.prefixCommands.get(commandName);

      // if (!command) return;
      // await command.execute(message, client, args);
    } catch (error) {
      await handleMessageError(client, message, error)
    }
  },
};
