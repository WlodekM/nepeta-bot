import { Level, NepetaUser } from "./main.ts";

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
			storage: {}
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