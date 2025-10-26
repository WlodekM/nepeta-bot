import { Message } from "discord.js";
import { Command } from "../main.ts";

export default {
	command: 'help',
	aliases: ['?'],
	run: async function points(message: Message, _) {
		await message.reply(`hello!! this is the help menu\n\ncommands:\n${
			Object.values(commands as Record<string,Command>)
				.map<string>(c => ` \- \`n!${c.command}\`${
					c.aliases && c.aliases.length > 0 ? ' aliases: ' + c.aliases.join(', '):''
				}`).join('\n')
		}`);
	}
} as Command;
