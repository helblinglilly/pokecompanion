import { getTagsByUser, type ITags } from '$lib/pb/tags';
import { writable } from 'svelte/store';
import { currentUser } from './user';
import { addNotification } from './notifications';
import type { ITagMove, ITagPokemon } from '$lib/types/ITags';
import type { IDisplayPokemon } from './pokemonPage';
import { Logger } from '$lib/log';

export const tagStore = writable<ITags[]>([]);

/* There are currently functions in here to add/remove each possible content of
 * a tag. Before adding the next type of content, these should really be
 * abstracted and refactored.
 */

export async function refetchTags(userId: string) {
	try {
		const tags = await getTagsByUser(userId);
		tagStore.set(tags);
	} catch (err) {
		addNotification({ message: 'Failed to get tags for user', level: 'failure' });
		await Logger.error(
			Logger.ErrorClasses.TagOperation,
			Logger.buildError(err),
			{
				context: 'Failed to get tags for user',
				user: userId,
			}
		)
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

		await Logger.error(
			Logger.ErrorClasses.TagOperation,
			Logger.buildError(err),
			{
				name,
				user: userId
			}
		)
	}
}

export async function addPokemonToTag(pokemon: ITagPokemon, tagId: string) {
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
			case 200:
			case 201:
				return;
			case 403:
			case 401:
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
		await Logger.error(
			Logger.ErrorClasses.TagOperation,
			Logger.buildError(err),
			{
				context: 'Add Pokemon to Tag',
				tag: tagId,
				pokemon: pokemon.id
			}
		)
	}
}

export async function addMoveToTag(move: ITagMove, tagId: string) {
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
			case 200:
			case 201:
				return;
			case 403:
			case 401:
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
		await Logger.error(
			Logger.ErrorClasses.TagOperation,
			Logger.buildError(err),
			{
				context: 'Add Move to Tag',
				tag: tagId,
				move: move.id
			}
		)
	}
}

export async function removePokemonFromTag(pokemon: ITagPokemon, tagId: string) {
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
			case 200:
			case 201:
				return;
			case 403:
			case 401:
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
		await Logger.error(
			Logger.ErrorClasses.TagOperation,
			Logger.buildError(err),
			{
				context: 'Remove Pokemon from Tag',
				tag: tagId,
				pokemon: pokemon.id
			}
		)
	}
}

export async function removeMoveFromTag(move: ITagMove, tagId: string) {
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
			case 200:
			case 201:
				return;
			case 403:
			case 401:
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
		await Logger.error(
			Logger.ErrorClasses.TagOperation,
			Logger.buildError(err),
			{
				context: 'Remove Move from Tag',
				tag: tagId,
				move: move.id,
			}
		)
	}
}

export function doesTagContainPokemon(pokemon: IDisplayPokemon, tag: ITags) {
	return tag.contents.pokemon?.some((a) => {
		return (
			a.id === pokemon.id &&
			(!pokemon.hasShinySprite || !a.shiny || a.shiny === pokemon.showShinySpriteIfExists) &&
			(!pokemon.gender || !a.gender || a.gender === pokemon.gender) &&
			((pokemon.variety?.includes('-default') && !a.variety) || pokemon.variety === a.variety)
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
