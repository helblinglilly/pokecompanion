import type { paths } from '$/@types/api';
import type { APITag, ITag } from '$/@types/api.pokecompanion';
import { Logger } from '$/debt/log';
import { addNotification } from '$/lib/stores/notifications';
import { PUBLIC_API_HOST } from '$env/static/public';

type ITagEntryGenerics = {
	added: string;
	id: number;
};
export function getSortFunction(key: ITag['sortKey'], direction: ITag['sortOrder']) {
	const sortByDateDesc = (a: ITagEntryGenerics, b: ITagEntryGenerics): -1 | 1 => {
		return new Date(a.added).valueOf() < new Date(b.added).valueOf() ? 1 : -1;
	};

	const sortByDateAsc = (a: ITagEntryGenerics, b: ITagEntryGenerics): -1 | 1 => {
		return new Date(a.added).valueOf() > new Date(b.added).valueOf() ? 1 : -1;
	};

	const sortByIdDesc = (a: ITagEntryGenerics, b: ITagEntryGenerics): -1 | 1 => {
		return a.id < b.id ? 1 : -1;
	};

	const sortByIdAsc = (a: ITagEntryGenerics, b: ITagEntryGenerics): -1 | 1 => {
		return a.id > b.id ? 1 : -1;
	};

	let sortFunction = sortByIdAsc;
	if (key === 'id') {
		if (direction === 'asc') {
			sortFunction = sortByIdAsc;
		} else {
			sortFunction = sortByIdDesc;
		}
	} else if (key === 'added') {
		if (direction === 'asc') {
			sortFunction = sortByDateAsc;
		} else {
			sortFunction = sortByDateDesc;
		}
	}

	return {
		sortFunction,
		sortKey: key.toLowerCase() as 'id' | 'added' | 'alphabetical' | 'custom',
		sortOrder: direction.toLowerCase() as 'asc' | 'desc' | 'custom'
	};
}

export function patchTag(
	tag: paths['/tags/{tagId}']['patch']['requestBody']['content']['application/json'] & {
		id: string;
	}
): Promise<APITag['tags'][number] | void> {
	return fetch(`${PUBLIC_API_HOST}/tags/${tag.id}`, {
		method: 'PATCH',
		body: JSON.stringify(tag),
		headers: {
			'Content-Type': 'application/json'
		},
		credentials: 'include'
	})
		.then(async (res) => {
			if (res.status !== 200) {
				throw new Error(`Non-200 status code ${res.status}`);
			}
			return (await res.json()) as APITag['tags'][number];
		})
		.catch((err) => {
			addNotification({
				message: 'Failed to update tag. Please try again',
				level: 'failure'
			});
			Logger.error(Logger.ErrorClasses.TagOperation, Logger.buildError(err), {
				context: 'Failed to update tag',
				tag: tag
			});
		});
}

export async function deleteTag(tagId: string) {
	try {
		const res = await fetch(PUBLIC_API_HOST + `/tags/${tagId}`, {
			method: 'DELETE',
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include'
		});

		switch (res.status) {
			case 204:
				return;
			case 401:
				addNotification({
					message:
						'Failed to delete tag due to authentication. Try signing out and back in, then try again',
					level: 'failure'
				});
				break;
			case 404:
				addNotification({
					message: 'The tag has already been deleted - it did not exist',
					level: 'failure'
				});
				break;
			default:
				throw new Error(`Non-204 status code`);
		}
	} catch (err) {
		addNotification({
			message: 'Failed to delete tag. Please try again',
			level: 'failure'
		});
	}
}
