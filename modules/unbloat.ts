
import {
	Events,
	type Client,
	type MessageReaction,
	type PartialMessageReaction
} from "discord.js";

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
		if (reaction.emoji.id === '1344012971713499136' &&
			!reaction.message.content?.includes('windows')) {
			return await reaction.remove()
		}
	})
}