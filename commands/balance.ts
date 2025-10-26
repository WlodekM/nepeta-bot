import { type Command } from "../main.ts";

export default {
	command: 'balance',
	aliases: ['bal'],
	run: async function balance(message, _args, _users, user, _items) {
		await message.reply(`you have ${user.data.money.toString()} moneys`);
	}
} as Command;
