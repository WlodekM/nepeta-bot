import { type Client } from "discord.js";
import type mongod from 'mongodb';
import type { NepetaUser } from '../main.ts';

// deno-lint-ignore no-explicit-any
const ADD: Record<string, any> = {
	state: "default",
	location: "gayplaza"
}

const REMOVE = {};

const MODIFY = {};

export default async function mount(
	_client: Client,
	users: mongod.Collection<NepetaUser>,
	// items: Record<string, Item>
) {
	for (const key in ADD) {
		if (!Object.prototype.hasOwnProperty.call(ADD, key))
			continue;
		const value = ADD[key];
		await users.updateMany({
			$where: function():boolean {
				return !Object.keys(this).includes(key)
			}
		}, {$set: {
			...Object.fromEntries([[key, value]])
		}})
	}
}