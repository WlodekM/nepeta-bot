import { type Command } from "../modules/commands.ts";

export default {
	command: 'eval',
	aliases: [],
	// deno-lint-ignore no-unused-vars
	run: async function run(message, args, users, user, items) {
		if (!user.dev)
			return await message.reply(`u r not dev, skill issue`);
		let code = args.join(' ').trim();
		if (code.match(/^```[a-zA-Z]*\n([^]*)```$/))
			code = /^```[a-zA-Z]*\n([^]*)```$/.exec(code)![1];
		try {
			await message.reply(`\`\`\`${String(eval(code))}\`\`\``) //.replaceAll(/[`*_\-+>~]/g, '\\$&')
		} catch (error) {
			await message.reply(`\`\`\`${String(error)}\`\`\``) //.replaceAll(/[`*_\-+>~]/g, '\\$&')
		}
	}
} as Command;
