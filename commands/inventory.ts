import { type Command } from "../main.ts";

export default {
	command: 'inventory',
	aliases: ['inv'],
	run: async function inventory(message, _args, _users, user, items) {
		await message.reply(`your inventory:\n${
			Object.entries(user.data.inventory)
				.filter(([_id, count]) => count > 0)
				.map(([id, count]) => {
					let str = `\`${id}\` - x${count}`;
					const def = items[id];
					if (!def) {
						str += ' [UNDEFINED]';
						return str;
					}
					if (def.usable) {
						str += ' (Usable'
						if (def.usable.one_time)
							str += ' One-time'
						str += ')'
					}

					return str;
				})
		}`);
	}
} as Command;
