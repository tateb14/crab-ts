import {
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle,
    Client,
    EmbedBuilder,
    Guild,
    Message,
    User,
} from "discord.js";
import guildExclusion from "../Models/guild-exclusion";
import userExclusion from "../Models/user-exclusion";
import { shield } from "../../emojis.json";

export async function guildExclusionCheckInteraction(
    client: Client,
    interaction: any
) {
    const guild = client.guilds.cache.get(interaction.guild.id);
    if (!guild) return;
    const guildExluded = await guildExclusion.findOne({
        crab_guildId: guild.id,
    });
    if (!guildExluded) return;
    const user = await interaction.guild.fetchOwner();
    const exclusionEmbed = new EmbedBuilder()
        .setColor(0xec3935)
        .setDescription(
            "This message is in regards of the recent exclusion from the service of **Crab**.\n\nTo clarify, an exclusion from our service comes very rarely and is only applied if a server has broken our terms of service or violated a major rule. Exclusions are not appealable, but they can be removed if an Executive Board member choses to.\n\nThe details of your exclusion are confidential and secure to only Crab staff members. If you wish to inquiry about the exclusion, please see our [support](https://discord.gg/8XScx8MNfE)."
        )
        .setFooter({ text: "Crab Legal Affairs Team" })
        .setTitle("Crab Exclusion Notice")
        .setTimestamp();

    const serverButton = new ButtonBuilder()
        .setCustomId("crab-button_server-name-disabled")
        .setDisabled(true)
        .setStyle(ButtonStyle.Secondary)
        .setLabel(`Official Notice from Tropical Systems`);
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        serverButton
    );
    try {
        await user.send({ embeds: [exclusionEmbed], components: [row] });
        await guild.leave();
    } catch (error) {
        return;
    }
}

export async function userExclusionCheckInteraction(
    client: Client,
    interaction: any
) {
    const user = client.guilds.cache.get(interaction.user.id);
    if (!user) return;
    const userExcluded = await userExclusion.findOne({
        crab_guildId: user.id,
    });
    if (!userExcluded) return;
    return interaction.reply(
        `${shield} You have been excluded from this service and cannot run any commands.`
    );
}

export async function guildExclusionCheckMessage(
    client: Client,
    message: Message
) {
    const guild = client.guilds.cache.get(message.guild!.id);
    if (!guild) return;
    const guildExluded = await guildExclusion.findOne({
        crab_guildId: guild.id,
    });
    if (!guildExluded) return;
    const user = await message.guild!.fetchOwner();
    const exclusionEmbed = new EmbedBuilder()
        .setColor(0xec3935)
        .setDescription(
            "This message is in regards of the recent exclusion from the service of **Crab**.\n\nTo clarify, an exclusion from our service comes very rarely and is only applied if a server has broken our terms of service or violated a major rule. Exclusions are not appealable, but they can be removed if an Executive Board member choses to.\n\nThe details of your exclusion are confidential and secure to only Crab staff members. If you wish to inquiry about the exclusion, please see our [support](https://discord.gg/8XScx8MNfE)."
        )
        .setFooter({ text: "Crab Legal Affairs Team" })
        .setTitle("Crab Exclusion Notice")
        .setTimestamp();

    const serverButton = new ButtonBuilder()
        .setCustomId("crab-button_server-name-disabled")
        .setDisabled(true)
        .setStyle(ButtonStyle.Secondary)
        .setLabel(`Official Notice from Tropical Systems`);
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        serverButton
    );
    try {
        await user.send({ embeds: [exclusionEmbed], components: [row] });
        await guild.leave();
    } catch (error) {
        return;
    }
}

export async function userExclusionCheckMessage(
    client: Client,
    message: Message
) {
    const user = client.guilds.cache.get(message.author.id);
    if (!user) return;
    const userExcluded = await userExclusion.findOne({
        crab_guildId: user.id,
    });
    if (!userExcluded) return;
    return message.reply(
        `${shield} You have been excluded from this service and cannot run any commands.`
    );
}

export async function guildExclusionCheck(client: Client, guild: Guild) {
    if (!guild) return;
    const guildExluded = await guildExclusion.findOne({
        crab_guildId: guild.id,
    });
    if (!guildExluded) return;
    const user = await guild.fetchOwner();
    const exclusionEmbed = new EmbedBuilder()
        .setColor(0xec3935)
        .setDescription(
            `This message is in regards of the recent exclusion from the service of **Crab**.
      \n
      \n
      To clarify, an exclusion from our service comes very rarely and is only applied if a server has broken our terms of service or violated a major rule. Exclusions are not appealable, but they can be removed if an Executive Board member choses to.
      \n
      \n
      The details of your exclusion are confidential and secure to only Crab staff members. If you wish to inquiry about the exclusion, please see our [support](https://discord.gg/8XScx8MNfE).`
        )
        .setFooter({ text: "Crab Legal Affairs Team" })
        .setTitle("Crab Exclusion Notice")
        .setTimestamp();

    const serverButton = new ButtonBuilder()
        .setCustomId("crab_button-server_name_disabled")
        .setDisabled(true)
        .setStyle(ButtonStyle.Secondary)
        .setLabel(`Official Notice from Tropical Systems`);
    const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
        serverButton
    );
    try {
        await user.send({ embeds: [exclusionEmbed], components: [row] });
        await guild.leave();
    } catch (error) {
        return;
    }
}
