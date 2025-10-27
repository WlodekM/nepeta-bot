import {
	Client,
	Events,
	GatewayIntentBits
	//, type GuildEmoji,
	// type MessageReaction,
	// // type MessageReactionEventDetails,
	// type PartialUser,
	// type PartialMessageReaction
} from 'discord.js';
import mongod, { Collection } from 'mongodb';
// import hjson from 'hjson';
import items from './import_item_data.ts'
import { NepetaUser } from './user.ts';
import type { Command } from './modules/commands.ts'
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

function quirkify(text: string) {
	const replacers: Record<string,string> = {
		per: 'purr',
		'po[^o]': 'paw',
		'po$': 'paw',
		hello: 'hewwo',
		//TODO: read up on nepeta's puns
	};

	const pattern = new RegExp(
	Object.keys(replacers)
		// .map(k => k.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
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
globalThis.coll = users

for (const name of fs.readdirSync('modules').filter(p => p.endsWith('.ts'))) {
	const { default: mount } = await import(`./modules/${name}`);
	await mount(client, users, items)
}

client.login(token)
