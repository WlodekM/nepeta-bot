import { Command } from "../main.ts";

const sallarries: Record<string, number> = {
	'mcfaggots-cook': 20
}

export default {
	command: 'work',
	aliases: [],
	run: async function work(message, _args, _users, user, _items) {
		if (!user.data.flags.includes('employed'))
			return message.reply(`GO GET A JOB DUNPASS`);
		if (user.data.storage.work_cooldown &&
			user.data.storage.work_cooldown > Date.now()
		)
			return message.reply(`woah, chill out, no one wants to work as a minimum-wage slave *that* much. come back at ${user.data.storage.work_cooldown} millisecond unix (that's <t:${Math.floor(user.data.storage.work_cooldown/1000)}> for you non-nerds)`);
		user.data.money += sallarries[user.data.storage.job!] ?? 20;
		user.data.storage.work_cooldown = Date.now() + (1000*60*30);
		await user.update();
		return message.reply(`you worked for half an hour, you got ${sallarries[user.data.storage.job!] ?? 20} money, you now have ${user.data.money} money.\
 you can work again at ${user.data.storage.work_cooldown} millisecond unix (that's <t:${Math.floor(user.data.storage.work_cooldown/1000)}> for you non-nerds)`);
	}
} as Command;
