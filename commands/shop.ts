import { type Command } from "../main.ts";

export default {
	command: 'shop',
	aliases: ['store'],
	run: async function shop(message, _args, _users, _user, items) {
		await message.reply(`shop:\n${
			Object.values(items)
				.filter(item => item.purchaseable)
				.map(item => `> **${item.id}** - ${item.description.replaceAll('\n', '\n> ')}
> cost: ${item.purchaseable!.cost}`)
		}`);
	}
} as Command;
