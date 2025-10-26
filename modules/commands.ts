
import { Events, type Client, type Message } from "discord.js";
import handle_command from "../command_handler.ts";
import type mongod from 'mongodb';
import type { NepetaUser } from '../main.ts';
import type { Item } from '../item_data_types.ts';

export default function mount(
	client: Client,
	users: mongod.Collection<NepetaUser>,
	items: Record<string, Item>
) {
	client.on(Events.MessageCreate, async (message: Message) => {
		const channel = message.guild?.channels.cache
			.find(c => c.id == message.channelId);
		console.log(`#${channel?.name ?? '<unknown>'}`, message.content)

		if (message.content.startsWith('n!'))
			await handle_command(message, users, items)
	})
}