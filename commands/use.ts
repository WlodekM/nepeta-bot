import { type Command } from "../modules/commands.ts";

export default {
	command: 'use',
	aliases: [],
	run: async function use(message, args, _users, user, items) {
		const item_name = args[0];
		if (!item_name)
			return await message.reply(`usage: n!use [item_name]`);
		if (!user.data.inventory[item_name] || user.data.inventory[item_name] < 1)
			return await message.reply(`you do not have that item`);
		const item = items[item_name];
		if (!item)
			return await message.reply(`item is undefined`);
		if (!item.usable)
			return await message.reply(`item is not usable`);

		try {
			const script = await import('../'+item.usable!.script);
			if (item.usable!.invoke)
				await script[item.usable!.invoke](message, user, items, item.usable!.parameters);
			if (item.usable!.one_time)
				user.data.inventory[item_name]--;
			
			await user.update()
		} catch (error) {
			return await message.reply(String(error instanceof Error ? error.stack ?? error : error))
		}

		// return await message.reply(`\`\`\`json\n${JSON.stringify(item, null, 2)}\`\`\``)
	}
} as Command;
