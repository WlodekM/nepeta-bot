import type { Message } from "discord.js";
import type { Item } from "../item_data_types.ts";
import type User from "../user.ts";

export default async function use(message: Message, user: User, _items: Record<string, Item>, params?: Record<string,string|number|(string|number)[]>) {
	user.data.flags = [...new Set<string>([...user.data.flags, "employed"])];
	user.data.storage.job = String(params?.job ?? 'mcfaggots-cook');
	await user.update();
	await message.reply(String(params?.message ?? `congratulations, you are now a cook in the nearest McFggots, you can now work using \`n!work\` to earn money!`));
}