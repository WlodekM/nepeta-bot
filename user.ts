import { Level } from "./main.ts";

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
	},
	state: string,
	location: string,
}

export default class User {
	id: string;
	data: NepetaUser;
	dev: boolean;
	constructor(id: string) {
		this.id = id;
		this.data = {
			id,
			health: 100,
			level: {
				level: 0,
				xp: 0,
				xp_to_next: 100
			},
			money: 5,
			flags: [],
			inventory: {
				'nepeta:job_application': 1
			},
			storage: {},
			state: "default",
			location: 'gayplaza'
		}
		this.dev = id == '1050350077551587338'
	}
	async load() {
		const data = await coll.findOne({ id: this.id });
		if (!data)
			return await coll.insertOne({ ...this.data });
		this.data = data;
	}
	async update() {
		await coll.replaceOne({ id: this.id }, this.data)
	}
}
