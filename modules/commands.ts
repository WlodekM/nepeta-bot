
import { Events, type Client, type Message } from "discord.js";
import handle_command from "../command_handler.ts";
import type mongod from 'mongodb';
import type { NepetaUser } from '../user.ts';
import type { Item } from '../item_data_types.ts';
import User from "../user.ts";

export interface Command {
	command: string,
	aliases?: string[],
	state?: string[],
	run: ((message: Message, args: string[], users: mongod.Collection<NepetaUser>, user: User, _items: Record<string, Item>)
			=> void) |
		((message: Message, args: string[], users: mongod.Collection<NepetaUser>, user: User, _items: Record<string, Item>)
			=> Promise<void>)
}

export default async function mount(
	client: Client,
	users: mongod.Collection<NepetaUser>,
	items: Record<string, Item>
) {
	const commands: Record<string, Command> = {}
	const commandFiles = Deno.readDirSync('commands');

	for (const file of commandFiles) {
		if (!file.name.match(/\.(ts|js)$/g))
			continue;
		const command: Command = (await import('../commands/'+file.name)).default;
		commands[file.name] = command
	}

	//@ts-ignore:
	globalThis.commands = commands;
	client.on(Events.MessageCreate, async (message: Message) => {
		const channel = message.guild?.channels.cache
			.find(c => c.id == message.channelId);
		console.log(`#${channel?.name ?? '<unknown>'}`, message.content)

		if (message.content.startsWith('n!'))
			await handle_command(message, users, items)
	})
}