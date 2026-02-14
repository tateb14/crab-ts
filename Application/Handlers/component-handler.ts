import chalk from "chalk";
import { Client } from "discord.js";
import * as path from "path";
import { fileURLToPath } from "url";
import { config } from '../config';
import { getAllFiles } from "../Functions/get-all-files";

export default async (client: Client) => {
    const clientEnviroment = config.client.enviroment;
    //? Define __dirname and __filename
    const __filename = fileURLToPath(import.meta.url);
    const __dirname = path.dirname(__filename);
    
    const selectMenuPath = path.join(__dirname, "..", "Components", "Menus");
    const buttonPath = path.join(__dirname, "..", "Components", "Buttons");
    const modalPath = path.join(__dirname, "..", "Components", "Modals");

    const selectMenuFiles = getAllFiles(selectMenuPath);
    const buttonFiles = getAllFiles(buttonPath);
    const modalFiles = getAllFiles(modalPath);

    client.buttons = new Map();
    client.selectMenus = new Map();
    client.modals = new Map();
    
    try {
        for (const selectMenuFilePath of selectMenuFiles) {
            const selectMenuModule = await import(selectMenuFilePath);
            const selectMenuFileData = selectMenuModule.default;
            
            if (selectMenuFileData && selectMenuFileData.customId) {
                client.selectMenus.set(
                    selectMenuFileData.customId,
                    selectMenuFileData
                );
            }
        }

        for (const buttonFilePath of buttonFiles) {
            const buttonModule = await import(buttonFilePath);
            const buttonFile = buttonModule.default;

            if (buttonFile && buttonFile.customId) {
                client.buttons.set(buttonFile.customId, buttonFile);
            }
        }

        for (const modalFilePath of modalFiles) {
            const modalModule = await import(modalFilePath);
            const modalFile = modalModule.default;

            if (modalFile && modalFile.customId) {
                client.modals.set(modalFile.customId, modalFile);
            }
        }
        
        console.log(
            chalk.green.bold("[TS-HANDLER-SUCCESS] ") +
                `🐚 Successfully registered ${client.selectMenus.size} select menus, ${client.buttons.size} buttons, and ${client.modals.size} modals.`
        );
    } catch (error) {
        throw new Error(
            chalk.red.bold("[TS-HANDLER-ERR] ") +
                `🐚 Failed to handler 1 or more components.` +
                error
        );
    }
};
