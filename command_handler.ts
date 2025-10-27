import {
	type Message
} from 'discord.js';
import type mongod from 'mongodb';
import type { NepetaUser } from './user.ts';
import type { Item } from './item_data_types.ts';
import User from './user.ts';

export default async function handle_command(
	message: Message,
	users: mongod.Collection<NepetaUser>,
	items: Record<string, Item>
) {
	const content = message.content.replace(/^n!/, '');
	const [commandName, ...args] = content.split(' ')

	const command = Object.values(commands)
		.find(c => c.command == commandName
			|| (c.aliases && c.aliases.includes(commandName)));

	if (!command)
		return message.reply(quirkify(`unknown command \`${commandName}\``));

	const user = new User(message.author.id.toString());
	await user.load();

	if ( ("state" in command) && !command.state?.includes(user.data.state) )
		return;

	try {
		command.run(message, args, users, user, items)
	} catch (error) {
		message.reply(`Error while running command.\n\`\`\`
${error instanceof Error ? error.stack??error:error}
\`\`\``)
	}
}
