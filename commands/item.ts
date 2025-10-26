import { type Command } from "../main.ts";

export default {
	command: 'item',
	aliases: ['info'],
	run: async function inventory(message, args, _users, _user, items) {
		const item_name = args[0];
		if (!item_name)
			return await message.reply(`usage: n!item [item_name]`);
		const item = items[item_name];
		if (!item)
			return await message.reply(`item not found`);
		return await message.reply(`\`\`\`json\n${JSON.stringify(item, null, 2)}\`\`\``)
	}
} as Command;
