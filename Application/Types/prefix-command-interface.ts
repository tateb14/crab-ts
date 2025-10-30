import { Message } from "discord.js";

export interface PrefixCommand {
  command: string;
  execute: (message: Message, args: string[]) => Promise<void>;
}
