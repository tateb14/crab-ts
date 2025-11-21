import { Message } from "discord.js";
import { exec } from "child_process";
import simpleGit from "simple-git";
import * as chalk from "chalk";
import * as emojis from "../../../emojis.json";
import * as config from "../../../config.json";
export default {
    command: "c-restart",
    execute: async (message: Message) => {
        const git = simpleGit();
        const authorizedRoles = ["1265766750994043022", "1337250124530847876"];
        const authorizedGuild = config.guilds["ts-main"];

        if (!message.guild) return;
        if (!message.member) return;

        if (message.guild.id !== authorizedGuild) return;
        if (
            !authorizedRoles.some((roleId) =>
                message.member!.roles.cache.has(roleId)
            )
        )
            return;

        const respone = await message.reply(
            "Pulling the latest commits from GitHub"
        );
        try {
            await git.pull("master");

            await respone.edit(
                `${emojis.check} Updates pulled successfully and the server has restarted!`
            );

            exec("pm2 restart Crab", (error, stdout, stderr) => {
                if (error) {
                    console.error(
                        chalk.bold.red(
                            `[TS-OPS-ERR] 🦑 Error restarting PM2: ${error.message}`
                        )
                    );
                    return respone.edit(`${emojis.x} Failed to restart PM2.`);
                }
                if (stderr) {
                    console.error(
                        chalk.bold.red(`[TS-OPS-ERR] 🦑 PM2 stderr: ${stderr}`)
                    );
                    return respone.edit(
                        `${emojis.alert} PM2 reported an error`
                    );
                }
                respone.edit(`${emojis.check} Server updated successfully!`);
            });
        } catch (error) {
            console.error(
                chalk.bold.red(
                    `[TS-OPS-ERR] 🦑 Error pulling from Git: ${error}`
                )
            );
            await respone.edit(`${emojis.x} Failed to pull updates.`);
        }
    },
};
