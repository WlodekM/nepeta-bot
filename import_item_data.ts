import fs from 'node:fs';
import path from 'node:path';
import hjson from 'hjson';
import schema from "ajv";
import ts_schema from "typescript-json-schema";
import { Item } from './item_data_types.ts'
import jsonc from 'tiny-jsonc';

const items: Record<string, Item> = {};

const item_schema = ts_schema.generateSchema(ts_schema.getProgramFromFiles([
	'item_data_types.ts'
], {
	esModuleInterop: true
}), 'Item', {
	required: true,
});

if (item_schema?.$schema)
	item_schema.$schema = item_schema?.$schema.replace(/#$/,'')

Deno.writeTextFileSync('./item.schema.json', JSON.stringify(item_schema))

const validator = new schema.Ajv({
	strict: true
})

const parsers: Record<string, {parse: (text: string) => object}> = {
	hjson,
	json: JSON,
	jsonc
}

function scan_dir(dir_path: string) {
	const children = fs.readdirSync(dir_path);
	for (const name of children) {
		const stats = fs.statSync(path.join(dir_path, name));
		if (stats.isDirectory()) {
			scan_dir(path.join(dir_path, name));
			continue;
		}
		if (!name.endsWith('.hjson') &&
			!name.endsWith('.json') &&
			!name.endsWith('.jsonc'))
			continue;

		const contents = fs.readFileSync(path.join(dir_path, name)).toString();
		const item: Item & {$schema?: string} = parsers[name.split('.').at(-1)!]
			.parse(contents) as Item;

		if (item.$schema)
			delete item.$schema

		check_schema:
		if (item_schema) {
			const result = validator.validate(item_schema, item);
			if (result)
				break check_schema
			console.error(`found errors in ${dir_path}/${name}`);
			throw validator.errorsText();
		}

		const identifier = `${item.namespace}:${item.id}`;
		
		if (items[identifier])
			console.warn(`WARN - overriding item ${identifier}`);

		items[identifier] = item;
	}
}

scan_dir('items/')

export default items;
