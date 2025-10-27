import type { Message, Client } from "discord.js";
import type mongod from 'mongodb';
import type { NepetaUser } from '../../user.ts';
import type { Item } from "../../item_data_types.ts";

export default async function mount(
	_client: Client,
	_users: mongod.Collection<NepetaUser>,
	_items: Record<string, Item>,
	_message?: Message
) {
	// if (message)
	// 	message.reply(``)
}