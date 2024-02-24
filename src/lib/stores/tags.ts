import { getTagsByUser, type ITags } from '$lib/pb/tags';
import { writable } from 'svelte/store';
import { currentUser } from './user';
import { error } from '$lib/log';
import { addNotification } from './notifications';
import type { ITagMove, ITagMoveNew, ITagPokemon, ITagPokemonNew } from '$lib/types/ITags';
import type { IDisplayPokemon } from './pokemonPage';

export const tagStore = writable<ITags[]>([]);

/* There are currently functions in here to add/remove each possible content of
 * a tag. Before adding the next type of content, these should really be
 * abstracted and refactored.
 */

export async function refetchTags(userId: string) {
	try {
		tagStore.set(await getTagsByUser(userId));
	} catch (err) {
		error(
			'Failed to get tags for user',
			'FailedToGetTagsByUser',
			`User: ${userId}, ${JSON.stringify(err)}`
		);
		addNotification({ message: 'Failed to get tags for user', level: 'failure' });
	}
}

export async function createTag(
	userId: string,
	name: string,
	isPrivate: boolean,
	initialContent?: {
		pokemon?: ITagPokemon[];
		move?: ITagMove[];
	}
) {
	try {
		const actualInitialContent = {
			pokemon: initialContent?.pokemon ?? [],
			move: initialContent?.move ?? []
		};
		const payload = {
			name,
			isPrivate,
			initialContent: actualInitialContent,
			showGenderAndShiny: true
		};

		const response = await fetch('/api/tags', {
			method: 'POST',
			body: JSON.stringify(payload)
		});

		if (!response.ok) {
			throw new Error(`${response.status}, ${JSON.stringify(payload)}`);
		}
		addNotification({
			message: `Created new ${isPrivate ? 'private' : ''} tag "${name}"`,
			level: 'success'
		});

		await refetchTags(userId);
	} catch (err) {
		addNotification({ message: 'Failed to create tag', level: 'failure' });
		error(
			'Failed to create new tag',
			'FailedToCreateTag',
			`New Name: ${name}, Private: ${isPrivate}, Error: ${JSON.stringify(err)}`
		);
	}
}

export async function addPokemonToTag(pokemon: ITagPokemonNew, tagId: string) {
	try {
		const res = await fetch(`/api/tag`, {
			method: 'POST',
			body: JSON.stringify({
				id: tagId,
				contents: {
					pokemon: [
						{
							...pokemon,
							added: new Date().toISOString()
						}
					]
				}
			})
		});
		switch (res.status) {
			case 200 || 201:
				return;
			case 403 || 401:
				addNotification({
					message: `Could not add tag due to authentication. Please sign in and try again`,
					level: 'failure'
				});
				break;
			default:
				throw new Error(`Unsuccessful response code: ${res.status}`);
		}
	} catch (err) {
		addNotification({ message: 'Could not add tag. Please try again', level: 'failure' });
		error(
			'Failed to add item to tag',
			'FailedToAddToTag',
			`Tag ID: ${tagId}, Pokemon: ${pokemon.id}, Error: ${JSON.stringify(err)}`
		);
	}
}

export async function addMoveToTag(move: ITagMoveNew, tagId: string) {
	try {
		const res = await fetch(`/api/tag`, {
			method: 'POST',
			body: JSON.stringify({
				id: tagId,
				contents: {
					move: [
						{
							...move,
							added: new Date().toISOString()
						}
					]
				}
			})
		});
		switch (res.status) {
			case 200 || 201:
				return;
			case 403 || 401:
				addNotification({
					message: `Could not add tag due to authentication. Please sign in and try again`,
					level: 'failure'
				});
				break;
			default:
				throw new Error(`Unsuccessful response code: ${res.status}`);
		}
	} catch (err) {
		addNotification({ message: 'Could not add tag. Please try again', level: 'failure' });
		error(
			'Failed to add item to tag',
			'FailedToAddToTag',
			`Tag ID: ${tagId}, Move: ${move}, Error: ${JSON.stringify(err)}`
		);
	}
}

export async function removePokemonFromTag(pokemon: ITagPokemonNew, tagId: string) {
	try {
		const res = await fetch('/api/tag', {
			method: 'DELETE',
			body: JSON.stringify({
				id: tagId,
				contents: {
					// make sure to be specific on variety/gender/shiny as well on backend
					pokemon: [{ id: pokemon.id }]
				}
			})
		});
		switch (res.status) {
			case 200 || 201:
				return;
			case 403 || 401:
				addNotification({
					message: `Could not remove tag due to authentication. Please sign in and try again`,
					level: 'failure'
				});
				break;
			default:
				throw new Error(`Unsuccessful response code: ${res.status}`);
		}
	} catch (err) {
		addNotification({ message: 'Could not remove tag. Please try again', level: 'failure' });
		error(
			`Failed to remove item from tag'`,
			'FailedToRemoveFromTag',
			`Tag ID: ${tagId}, Pokemon: ${pokemon.id}, Error: ${JSON.stringify(err)}`
		);
	}
}

export async function removeMoveFromTag(move: ITagMoveNew, tagId: string) {
	try {
		const res = await fetch('/api/tag', {
			method: 'DELETE',
			body: JSON.stringify({
				id: tagId,
				contents: {
					move: [{ id: move.id }]
				}
			})
		});
		switch (res.status) {
			case 200 || 201:
				return;
			case 403 || 401:
				addNotification({
					message: `Could not remove tag due to authentication. Please sign in and try again`,
					level: 'failure'
				});
				break;
			default:
				throw new Error(`Unsuccessful response code: ${res.status}`);
		}
	} catch (err) {
		addNotification({ message: 'Could not remove tag. Please try again', level: 'failure' });
		error(
			`Failed to remove item from tag'`,
			'FailedToRemoveFromTag',
			`Tag ID: ${tagId}, Pokemon: ${move.id}, Error: ${JSON.stringify(err)}`
		);
	}
}

export function doesTagContainPokemon(pokemon: IDisplayPokemon, tag: ITags) {
	return tag.contents.pokemon?.some((a) => {
		return (
			a.id === pokemon.id &&
			(!pokemon.hasShinySprite || !a.shiny || a.shiny === pokemon.showShinySpriteIfExists) &&
			(!pokemon.gender || !a.gender || a.gender === pokemon.gender) &&
			(!a.variety ||
				(a.variety.name === pokemon.variety?.name &&
					a.variety.spriteId === pokemon.variety.spriteId))
		);
	});
}

export function doesTagContainMove(moveId: number, tag: ITags) {
	return tag.contents.move?.some((a) => {
		return a.id === moveId;
	});
}

currentUser.subscribe(async (user) => {
	tagStore.set([]);
	if (user) {
		await refetchTags(user.id);
	}
});
