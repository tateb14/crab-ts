const {
  EmbedBuilder,
  inlineCode,
  ButtonBuilder,
  ButtonStyle,
  ActionRowBuilder,
  MessageFlags,
} = require("discord.js");
const { exec } = require("child_process")
const simpleGit = require("simple-git");
const chalk = require("chalk");
const git = simpleGit();
const { check, x, alert } = require("../../../emojis.json")
module.exports = {
  command: "c-restart",
  execute: async (message, client) => {
    const AuthorizedRoles = ["1265766750994043022", "1337250124530847876"];
    if (message.guild.id === "1265766606555054142") {
      if (AuthorizedRoles.some((roleId) => message.member.roles.cache.has(roleId))) {
        const respone = await message.reply("Pulling the latest commits from GitHub")
        try {
          const pullResult = await git.pull("master");
          console.log(pullResult);

          await respone.edit(`${check} Updates pulled successfully and the server has restarted!`);

          exec("pm2 restart Crab", (error, stdout, stderr) => {
                if (error) {
                    console.error(chalk.red(`[SERVER] [PM2] Error restarting PM2: ${error.message}`));
                    return respone.edit(`${x} Failed to restart PM2.`);
                }
                if (stderr) {
                    console.error(chalk.red(`[SERVER] [PM2] PM2 stderr: ${stderr}`));
                    return respone.edit(`${alert} PM2 reported an error`);
                }
                console.log(`PM2 stdout: ${stdout}`);
                respone.edit(`${check} Server HI successfully!`);
            });

        } catch (error) {
            console.error(chalk.red("[SYSTEM] Error while pulling a GitHub commit:", error));
            await respone.edit(`${x} Failed to pull updates.`);

        }
      }
    }
  },
};
