import type { paths } from '$/@types/api';
import { Logger } from '$/debt/log';
import { addNotification } from '$/features/notifications/notifications';
import { DEPEND_TAG_ID } from '$/features/tags/depends';
import type { APITag } from '$/features/tags/types';
import { invalidate } from '$app/navigation';
import { PUBLIC_API_HOST } from '$env/static/public';

export async function patchTag(
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
			invalidate(DEPEND_TAG_ID(tag.id));
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
