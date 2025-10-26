interface Purchaseable {
	cost: number
	//TODO - add like restock shit here
}

interface Usable {
	script: string
	/** function to invoke (import(PATH).FUNCTION_NAME()). set to "default" for default function */
	invoke?: string
	/** defaults to false */
	one_time?: boolean
	parameters?: Record<string, string | number | (string | number)[]>
}

interface Equipable {
	slot: Slot,
	/** -1 for unbreakable */
	durability: number,
}

type Slot = 'weapon' | 'armor'

export interface Item {
	id: string
	namespace: string
	description: string
	type: string
	purchaseable?: Purchaseable,
	usable?: Usable,
	equipable?: Equipable,
}