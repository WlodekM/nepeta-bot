import {
	Client,
	Events,
	GatewayIntentBits,
	type Message//, type GuildEmoji,
	// type MessageReaction,
	// // type MessageReactionEventDetails,
	// type PartialUser,
	// type PartialMessageReaction
} from 'discord.js';
import mongod, { Collection } from 'mongodb';
// import hjson from 'hjson';
import items from './import_item_data.ts'
import User from './user.ts';
import fs from 'node:fs';

export enum Level {
	Noob,
	Greentike,
	Juvesquirt,
	Plucky_Tot,
	Fidgety_Bopper,
	Anklebiter,
	Champ_Fry,
	Pesky_Urchin,
	Nipper_Cadet,
	Bravesprout,
	Cool_Buckaroo,
	Kneehigh_Pilgrim,
	Moppet_of_Destiny,
	Gadabout_Pipsqueak,
	Gender_Neutral_Skylark,
	Rumpus_Buster,
	Lodestar_Youth,
	Stoutrunt,
	Mr_or_Ms_or_other_Snoozyprince_McSleepypants,
	Calloused_Tenderfoot,
	Overbite_Upstart,
	Britches_Ripper,
	Scampermaster,
	YOU_ARE_THE_STAR,
	ITS_YOU,
	Junglegym_Swashbuckler,
	Unreal_Heir,
	Gritty_Midget,
	Rascalsprat,
	Rungjumpin_Ragamuffin,
	Scurrywart,
	Sharkbait_Sparkplug,
	Ectobiolobabysitter,
	Planet_Healer,
	Hammerkind_Paragon,
	The_Breeze_Kneels,
	Ripetike,
	Gender_Neutral_Skylark_two,
	Doctor_Ragnarok,
	Heir_Transparent,
	FAGGIEST_OF_THEM_ALL
}

const mongoClient = new mongod.MongoClient('mongodb://localhost:27017');
const db = mongoClient.db('nepeta')
export interface NepetaUser {
	id: string,
	inventory: Record<string, number>
	money: number,
	health: number,
	flags: string[],
	level: {
		xp: number,
		xp_to_next: number,
		level: Level
	},
	storage: {
		job?: string,
		work_cooldown?: number,
	}
}
const users: mongod.Collection<NepetaUser> = db.collection('users_war')

const token = Deno.readTextFileSync('token').replace(/\n$/,'');

const client = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.MessageContent,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMessageReactions,
	]
});

client.once(Events.ClientReady, readyClient => {
	console.log(`Ready! Logged in as ${readyClient.user.tag}`);
});

export interface Command {
	command: string,
	aliases?: string[],
	run: ((message: Message, args: string[], users: mongod.Collection<NepetaUser>, user: User, _items: typeof items)
			=> void) |
		 ((message: Message, args: string[], users: mongod.Collection<NepetaUser>, user: User, _items: typeof items)
		 	=> Promise<void>)
}
const commands: Record<string, Command> = {}
const commandFiles = Deno.readDirSync('commands');

for (const file of commandFiles) {
	if (!file.name.match(/\.(ts|js)$/g))
		continue;
	const command: Command = (await import('./commands/'+file.name)).default;
	commands[file.name] = command
}

function quirkify(text: string) {
	const replacers: Record<string,string> = {
		per: 'purr',
		po: 'paw',
		hello: 'hewwo',
		//TODO: read up on nepeta's puns
	};

	const pattern = new RegExp(
	Object.keys(replacers)
		.map(k => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
			.join("|"),
		"g"
	);

	return ':33 < ' + text
		.replace(pattern, match => replacers[match])
		.replace(/[lr]/gi, match => Math.random() <= 0.5 ?
			match :
			match.toLowerCase() == match ? 'w' : 'W'
		);
}
declare global {
	// let terezify: (text: string) => string;
	let quirkify: (text: string) => string;
	let commands: Record<string, Command>;
	let coll: Collection<NepetaUser>
};
//@ts-ignore:
// globalThis.terezify = quirkify;
globalThis.quirkify = quirkify;
//@ts-ignore:
globalThis.commands = commands;
//@ts-ignore:
globalThis.coll = users

async function handleCommand(message: Message) {
	const content = message.content.replace(/^n!/, '');
	const [commandName, ...args] = content.split(' ')

	const command = Object.values(commands)
		.find(c => c.command == commandName
			|| (c.aliases && c.aliases.includes(commandName)));

	if (!command)
		return message.reply(quirkify(`unknown command \`${commandName}\``));

	const user = new User(message.author.id.toString());

	await user.load();

	try {
		command.run(message, args, users, user, items)
	} catch (error) {
		message.reply(`Error while running command.\n\`\`\`
${error instanceof Error ? error.stack??error:error}
\`\`\``)
	}
}

client.on(Events.MessageCreate, async (message: Message) => {
	const channel = message.guild?.channels.cache
		.find(c => c.id == message.channelId);
	console.log(`#${channel?.name ?? '<unknown>'}`, message.content)

	if (message.content.startsWith('n!'))
		await handleCommand(message)
})

for (const name of fs.readdirSync('modules').filter(p => p.endsWith('.ts'))) {
	const { default: mount } = await import(`./modules/${name}`);
	await mount(client)
}

client.login(token)
