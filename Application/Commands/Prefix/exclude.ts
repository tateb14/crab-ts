import {
    EmbedBuilder,
    ButtonBuilder,
    ButtonStyle,
    ActionRowBuilder,
    Message,
} from "discord.js";
import * as emojis from "../../../emojis.json";
export default {
    command: "exclude",
    execute: async (message: Message) => {
        const authorizedUsers = [
            "653787450761543680",
            "658973112028626957",
            "1082009818526654464",
            "1265984568746573846",
        ];
        const authorizedGuild = "1348623820331679744";
        if (!message.guild) return;
        if (message.guild.id !== authorizedGuild) return;
        if (!authorizedUsers.includes(message.author.id)) return;
        const securityCheckpointEmbed = new EmbedBuilder()
            .setAuthor({
                name: `This command is restricted and has two levels of security.`,
            })
            .setDescription(
                "Please click the button below and input the access code provided to you by Chief Executive Officer."
            )
            .setColor(0xec3935)
            .setImage(
                "https://cdn.discordapp.com/attachments/1265767289924354111/1409647765188907291/CrabBanner-EmbedFooter-RedBG.png?ex=68ae2449&is=68acd2c9&hm=643546e45cccda97a49ab46b06c08471d89efbd76f2043d57d0db22cf5a1f657&"
            );

        const accessButton = new ButtonBuilder()
            .setCustomId(`crab_button-security_access:${message.author.id}`)
            .setEmoji(emojis.lock_pass)
            .setLabel("Enter Access Code")
            .setStyle(ButtonStyle.Danger);

        const securityRow = new ActionRowBuilder<ButtonBuilder>().addComponents(
            accessButton
        );
        message.reply({
            embeds: [securityCheckpointEmbed],
            components: [securityRow],
        });
    },
};
