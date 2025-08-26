const {
  EmbedBuilder,
  inlineCode,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  ActionRowBuilder
} = require("discord.js");
const UserFlag = require("../../schemas/CrabUserFlags");

module.exports = {
  command: "flag",
  aliases: ["f"],
  execute: async (message, client) => {
    const AuthorizedUsers = [
      "653787450761543680",
      "658973112028626957",
      "1082009818526654464",
      "1265984568746573846"
    ];

    if (message.guild.id !== "1348623820331679744") return;
    if (!AuthorizedUsers.includes(message.author.id)) return;

    const args = message.content.trim().split(/ +/);
    const UserID = args.slice(1).join(" ").toLowerCase();
    if (!UserID) return message.reply("Please provide a valid user ID.");

    try {
      const UserInformation = await client.users.fetch(UserID);
      const embed = new EmbedBuilder()
        .setColor(0xec3935)
        .setTitle("<:CrabIconWhite:1409689393161175091> Flag Application Panel")
        .setImage("https://cdn.discordapp.com/attachments/1265767289924354111/1409647765188907291/CrabBanner-EmbedFooter-RedBG.png?ex=68ae2449&is=68acd2c9&hm=643546e45cccda97a49ab46b06c08471d89efbd76f2043d57d0db22cf5a1f657&")
        .setDescription(
          `Please select which flag(s) to apply to <@${UserID}>. Once you have selected which flags to apply, they will automatically save. They will be displayed when using the ${inlineCode(
            "/whois"
          )} command, as well on the ${inlineCode(
            "$data"
          )} command.\n\n-# If you wish to remove a flag from a user, please deselect the corresponding option.`
        );

      const FlagSelect = new StringSelectMenuBuilder()
        .setCustomId(`crab-sm_flags:${UserID}`)
        .setPlaceholder("Toggle flags to a user's account.")
        .setMinValues(1)
        .setMaxValues(7)
        .addOptions(
          new StringSelectMenuOptionBuilder()
            .setLabel("Staff Impersonation Flag")
            .setDescription("This user has been caught allegedly impersonating staff of Tropical Systems.")
            .setEmoji("<:crab_alert:1400664519339937974>")
            .setValue("staff_impersonation"),

          new StringSelectMenuOptionBuilder()
            .setLabel("Exploiter Flag")
            .setDescription("This user has been caught attempting to exploit with our service.")
            .setEmoji("<:crab_alert:1400664519339937974>")
            .setValue("exploiter"),

          new StringSelectMenuOptionBuilder()
            .setLabel("Phishing/Scam Flag")
            .setDescription("This user has been caught using Crab to send scam/phishing links.")
            .setEmoji("<:crab_alert:1400664519339937974>")
            .setValue("scam"),

          new StringSelectMenuOptionBuilder()
            .setLabel("Raid/Spam Flag")
            .setDescription("This user has been caught in raid/spam activities.")
            .setEmoji("<:crab_alert:1400664519339937974>")
            .setValue("raid"),

          new StringSelectMenuOptionBuilder()
            .setLabel("Harassment Flag")
            .setDescription("This user has been caught harassing other individuals.")
            .setEmoji("<:crab_alert:1400664519339937974>")
            .setValue("harassment"),

          new StringSelectMenuOptionBuilder()
            .setLabel("Threats Flag")
            .setDescription("This user has been caught threatening other members.")
            .setEmoji("<:crab_alert:1400664519339937974>")
            .setValue("threats"),

          new StringSelectMenuOptionBuilder()
            .setLabel("Alt Account Flag")
            .setDescription("This user has used alternate accounts to evade punishments.")
            .setEmoji("<:crab_alert:1400664519339937974>")
            .setValue("alt_account")
        );

      const row = new ActionRowBuilder().addComponents(FlagSelect);
      message.reply({ embeds: [embed], components: [row] });
    } catch (err) {
      console.error("Error fetching user or building flag panel:", err);
      message.reply("Failed to fetch user or render flag panel.");
    }
  }
};
