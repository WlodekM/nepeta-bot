import type { Message } from "discord.js";
import type { Item } from "../item_data_types.ts";
import type User from "../user.ts";

export default async function use(message: Message, user: User, _items: Record<string, Item>, params?: Record<string,string|number|(string|number)[]>) {
	if (!params ||
		typeof params.name != 'string' ||
		typeof params.message != 'string' ||
		typeof params.hp != 'number')
		throw 'incorrect parameters to `consumable.ts>default()`';
	
	message.reply(`${params.message} You restored ${params.hp} HP.`);

	user.data.health = Math.min(user.data.health + params.hp, 100);

	await user.update();
}