import { pokeApiDomain } from '$lib/stores/domain.js';
import type { IMove } from '$lib/types/IMoves';

const loadMove = async (id: number): Promise<IMove> => {
	const response = await fetch(pokeApiDomain + `/move/${id}`);
	const body = (await response.json()) as IMove;
	return body;
};

export async function load({ params }) {
	const moveId = Number(params.slug);
	const move = await loadMove(moveId);

	return {
		move
	};
}
