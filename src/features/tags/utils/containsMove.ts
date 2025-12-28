import type { components } from '$/@types/api';
import type { MinimalTagMove } from '../types';

export function doesTagMoveContainMove(
	tag: components['schemas']['TagContents']['move'],
	move: MinimalTagMove | undefined
) {
	if (tag === undefined) {
		return false;
	}

	if (!move) {
		return false;
	}

	return tag.some((tag) => {
		return tag.id === move.id;
	});
}
