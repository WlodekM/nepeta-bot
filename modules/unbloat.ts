
import {
	Events,
	type Client,
	type MessageReaction,
	type PartialMessageReaction
} from "discord.js";

const manuls: string[] = [
	'1384983969984155678',
	'1404868487775522947',
	'1387195626609053766'
]

export default function mount(
	client: Client,
) {
	client.on(Events.MessageReactionAdd, async (
		reaction: MessageReaction | PartialMessageReaction,
	) => {
		if (reaction.partial) {
			try {
				await reaction.fetch();
			} catch (_) {
				return;
			}
		}
		if ([...reaction.users.cache.keys()].includes('1231321720036786206') &&
			!reaction.message.content?.includes('windows') &&
			!manuls.includes(String(reaction.emoji.id))) {
			console.log(reaction.emoji.id)
			return await reaction.remove()
		}
	})
}