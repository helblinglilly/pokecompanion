import type { IPokemonNames } from './+page.server';

export async function load({
	data
}: {
	data: {
		gen1: IPokemonNames[];
		gen2: IPokemonNames[];
		gen3: IPokemonNames[];
		gen4: IPokemonNames[];
		gen5: IPokemonNames[];
		gen6: IPokemonNames[];
		gen7: IPokemonNames[];
		gen8: IPokemonNames[];
		gen9: IPokemonNames[];
	};
}) {
	return {
		...data
	};
}
