import {
    EmbedBuilder,
    inlineCode,
    StringSelectMenuBuilder,
    StringSelectMenuOptionBuilder,
    ActionRowBuilder,
    Message,
    Client,
} from "discord.js";
import * as userFlags from "../../Models/crab-user-flags";
import * as emojis from "../../../emojis.json";
export default {
    command: "flag",
    aliases: ["f"],
    execute: async (message: Message, client: Client) => {
        const authorizedUsers = [
            "653787450761543680",
            "658973112028626957",
            "1082009818526654464",
            "1265984568746573846",
        ];
        const authorizedGuild = "1348623820331679744";

        if (!message.guild) return;
        if (message.guild.id !== "1348623820331679744") return;
        if (!authorizedUsers.includes(message.author.id)) return;

        const args = message.content.trim().split(/ +/);
        const userId = await client.users.fetch(args[1]);
        if (!userId) return message.reply("Please provide a valid user ID.");

        try {
            const flagEmbed = new EmbedBuilder()
                .setColor(0xec3935)
                .setTitle(`${emojis.icon} Flag Application Panel`)
                .setImage(
                    "https://cdn.discordapp.com/attachments/1265767289924354111/1409647765188907291/CrabBanner-EmbedFooter-RedBG.png?ex=68ae2449&is=68acd2c9&hm=643546e45cccda97a49ab46b06c08471d89efbd76f2043d57d0db22cf5a1f657&"
                )
                .setDescription(
                    `Please select which flag(s) to apply to <@${userId}>. Once you have selected which flags to apply, they will automatically save. They will be displayed when using the ${inlineCode(
                        "/whois"
                    )} command, as well on the ${inlineCode(
                        "$data"
                    )} command.\n\n-# If you wish to remove a flag from a user, please deselect the corresponding option.`
                );

            const flagSelect = new StringSelectMenuBuilder()
                .setCustomId(`crab_sm-flags:${userId}`)
                .setPlaceholder("Toggle flags to a user's account.")
                .setMinValues(1)
                .setMaxValues(7)
                .addOptions(
                    new StringSelectMenuOptionBuilder()
                        .setLabel("Staff Impersonation Flag")
                        .setDescription(
                            "This user has been caught allegedly impersonating staff of Tropical Systems."
                        )
                        .setEmoji(emojis.alert)
                        .setValue("staff_impersonation"),

                    new StringSelectMenuOptionBuilder()
                        .setLabel("Exploiter Flag")
                        .setDescription(
                            "This user has been caught attempting to exploit with our service."
                        )
                        .setEmoji(emojis.alert)
                        .setValue("exploiter"),

                    new StringSelectMenuOptionBuilder()
                        .setLabel("Phishing/Scam Flag")
                        .setDescription(
                            "This user has been caught using Crab to send scam/phishing links."
                        )
                        .setEmoji(emojis.alert)
                        .setValue("scam"),

                    new StringSelectMenuOptionBuilder()
                        .setLabel("Raid/Spam Flag")
                        .setDescription(
                            "This user has been caught in raid/spam activities."
                        )
                        .setEmoji(emojis.alert)
                        .setValue("raid"),

                    new StringSelectMenuOptionBuilder()
                        .setLabel("Harassment Flag")
                        .setDescription(
                            "This user has been caught harassing other individuals."
                        )
                        .setEmoji(emojis.alert)
                        .setValue("harassment"),

                    new StringSelectMenuOptionBuilder()
                        .setLabel("Threats Flag")
                        .setDescription(
                            "This user has been caught threatening other members."
                        )
                        .setEmoji(emojis.alert)
                        .setValue("threats"),

                    new StringSelectMenuOptionBuilder()
                        .setLabel("Alt Account Flag")
                        .setDescription(
                            "This user has used alternate accounts to evade punishments."
                        )
                        .setEmoji(emojis.alert)
                        .setValue("alt_account")
                );

            const flagRow =
                new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(
                    flagSelect
                );
            message.reply({ embeds: [flagEmbed], components: [flagRow] });
        } catch (err) {
            message.reply("Failed to fetch user or render flag panel.");
        }
    },
};
