import { writable } from 'svelte/store';
import { addNotification } from './notifications';
import type { IDisplayPokemon } from './pokemonPage';
import { Logger } from '$lib/log';
import type { ITagMove } from '$/routes/api/tag/types';
import type { IRecordPokemon } from '../types/IPokemon';
import type { APITag } from '$/@types/api.pokecompanion';
import { PUBLIC_API_HOST } from '$env/static/public';

export const tagStore = writable<APITag['tags']>([]);

export const getTagsByUser = async (id: string): Promise<APITag['tags']> => {
	if (!id) {
		return [];
	}

	try {
		const res = await fetch(PUBLIC_API_HOST + `/tags?userId=${id}`, {
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		});
		if (res.status !== 200) {
			throw new Error(`Tried to get user "${id}"'s tags and got HTTP ${res.status}`);
		}

		const body: APITag = await res.json();

		return body.tags;
	} catch (err) {
		await Logger.error(Logger.ErrorClasses.TagOperation, Logger.buildError(err), {
			context: 'Failed to get Tags by user',
			user: id
		});
		return [];
	}
};

export async function refetchTags(userId: string) {
	try {
		const tags = await getTagsByUser(userId);
		tagStore.set(tags);
	} catch (err) {
		addNotification({ message: 'Failed to get tags for user', level: 'failure' });
		await Logger.error(Logger.ErrorClasses.TagOperation, Logger.buildError(err), {
			context: 'Failed to get tags for user',
			user: userId
		});
	}
}

export async function getTagsByUsername(username: string): Promise<APITag['tags']> {
	try {
		const res = await fetch(PUBLIC_API_HOST + `/tags?username=${username}`, {
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		});
		if (res.status !== 200) {
			throw new Error(`Tried to get user "${username}"'s tags and got HTTP ${res.status}`);
		}

		const body: APITag = await res.json();

		return body.tags;
	} catch (err) {
		addNotification({ message: `Failed to get tags for ${username}`, level: 'failure' });
		return [];
	}
}

export async function addPokemonToTag(pokemon: IRecordPokemon, tagId: string) {
	try {
		const res = await fetch(`/api/tag/${tagId}/pokemon`, {
			method: 'POST',
			body: JSON.stringify(pokemon)
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
		await Logger.error(Logger.ErrorClasses.TagOperation, Logger.buildError(err), {
			context: 'Add Pokemon to Tag',
			tag: tagId,
			pokemon: pokemon.id
		});
	}
}

export async function addMoveToTag(move: ITagMove, tagId: string) {
	try {
		const res = await fetch(PUBLIC_API_HOST + `/tags/${tagId}/move`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify({
				moveId: move.id
			})
		});

		switch (res.status) {
			case 200:
			case 201:
				return;
			case 403:
			case 401:
				addNotification({
					message: `Could not add move to tag due to authentication. Please sign in and try again`,
					level: 'failure'
				});
				break;
			default:
				throw new Error(`Unsuccessful response code: ${res.status}`);
		}
	} catch (err) {
		addNotification({ message: 'Could not add tag. Please try again', level: 'failure' });
		await Logger.error(Logger.ErrorClasses.TagOperation, Logger.buildError(err), {
			context: 'Add Move to Tag',
			tag: tagId,
			move: move.id
		});
	}
}

export async function removePokemonFromTag(pokemon: IRecordPokemon, tagId: string) {
	try {
		const res = await fetch(`/api/tag/${tagId}/pokemon`, {
			method: 'DELETE',
			body: JSON.stringify(pokemon)
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
		await Logger.error(Logger.ErrorClasses.TagOperation, Logger.buildError(err), {
			context: 'Remove Pokemon from Tag',
			tag: tagId,
			pokemon: pokemon.id
		});
	}
}

export async function removeMoveFromTag(move: ITagMove | undefined, tagId: string) {
	if (!move) {
		return false;
	}
	try {
		const res = await fetch(PUBLIC_API_HOST + `/tags/${tagId}/move`, {
			method: 'DELETE',
			body: JSON.stringify({
				moveId: move.id
			}),
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		});

		switch (res.status) {
			case 200:
				return;
			case 400:
				addNotification({
					message: `Something about the request went wrong.`,
					level: 'failure'
				});
				break;
			case 401:
				addNotification({
					message: `Could not remove move from tag due to authentication. Please sign in and try again`,
					level: 'failure'
				});
				break;
			case 404:
				addNotification({
					message: `The tag no longer exists`,
					level: 'info'
				});
				break;
			default:
				addNotification({
					message: `The request to remove a move from a tag has failed. Please try again`,
					level: 'failure'
				});
				break;
		}
	} catch (err) {
		addNotification({ message: 'Could not remove tag. Please try again', level: 'failure' });
		await Logger.error(Logger.ErrorClasses.TagOperation, Logger.buildError(err), {
			context: 'Remove Move from Tag',
			tag: tagId,
			move: move.id
		});
	}
}

export function doesTagContainPokemon(
	pokemon: IDisplayPokemon | undefined,
	tag: APITag['tags'][number]
) {
	if (!pokemon) {
		return false;
	}

	return tag.contents.pokemon?.some((a) => {
		return (
			a.id === pokemon.id &&
			(!pokemon.hasShinySprite || !a.shiny || a.shiny === pokemon.showShinySpriteIfExists) &&
			(!pokemon.gender || !a.gender || a.gender === pokemon.gender) &&
			((pokemon.variety?.includes('-default') && !a.variety) || pokemon.variety === a.variety)
		);
	});
}

export function doesTagContainMove(
	move: Omit<ITagMove, 'added'> | undefined,
	tag: APITag['tags'][number]
) {
	if (!move) {
		return false;
	}
	return tag.contents.move?.some((a) => {
		return a.id === move.id;
	});
}
