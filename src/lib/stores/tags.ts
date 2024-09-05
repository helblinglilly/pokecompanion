import { getTagsByUser } from '$lib/pb/tags';
import { writable } from 'svelte/store';
import { currentUser } from './user';
import { addNotification } from './notifications';
import type { IDisplayPokemon } from './pokemonPage';
import { Logger } from '$lib/log';
import type { ITagMove, RecordTag } from '$/routes/api/tag/types';
import type { IRecordPokemon } from '../types/IPokemon';

export const tagStore = writable<RecordTag[]>([]);

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
		const res = await fetch(`/api/tag/${tagId}/move`, {
			method: 'POST',
			body: JSON.stringify(move)
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

export async function removePokemonFromTag(pokemon: IRecordPokemon, tagId: string) {
	try {
		const res = await fetch(`/api/tag/${tagId}/move`, {
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

export async function removeMoveFromTag(move: ITagMove | undefined, tagId: string) {
	if (!move){
		return false;
	}
	try {
		const res = await fetch(`/api/tag/${tagId}/move`, {
			method: 'DELETE',
			body: JSON.stringify(move)
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

export function doesTagContainPokemon(pokemon: IDisplayPokemon | undefined, tag: RecordTag) {
	if (!pokemon){
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

export function doesTagContainMove(move: ITagMove | undefined, tag: RecordTag) {
	if (!move){
		return false;
	}
	return tag.contents.move?.some((a) => {
		return a.id === move.id;
	});
}

currentUser.subscribe(async (user) => {
	if (user) {
		await refetchTags(user.id);
	}
});
