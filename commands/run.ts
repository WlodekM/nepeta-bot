import { type Command } from "../modules/commands.ts";

const td = new TextDecoder();
export default {
	command: 'run',
	aliases: [],
	// deno-lint-ignore no-unused-vars
	run: async function run(message, args, users, user, items) {
		let code = args.join(' ').trim();
		if (code.match(/^```[a-zA-Z]*\n([^]*)```$/))
			code = /^```[a-zA-Z]*\n([^]*)```$/.exec(code)![1];
		const cmd = new Deno.Command(`lua`, {
			args: ['-e', code],
			stderr: 'piped',
			stdout: 'piped'
		});
		const process = cmd.spawn()
		let done = false;
		const timeout = setTimeout(() => {
			if (done) return;
			process.kill();
			message.reply('timed out')
		}, 5000)
		const output = await process.output();
		await message.reply(`stdout:
\`\`\`\n${td.decode(output.stdout)}\`\`\`
stderr:
\`\`\`\n${td.decode(output.stderr)}\`\`\``);
		done = true;
		clearTimeout(timeout)
	}
} as Command;
