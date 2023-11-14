import { error, warn } from '$lib/log';
import { validateAuth } from '../helpers.js';
import type { ITag, ITagContents } from '$lib/types/ITags.js';

export async function POST({ request }) {
	const authedPb = await validateAuth(request);
	if (!authedPb) {
		return new Response('Not authorised', { status: 401 });
	}

	let body: { id: string; contents: ITagContents } | undefined;
	try {
		body = await request.json();
	} catch (err) {
		warn('Failed to parse JSON from request body', request);
		return new Response('Invalid body', {
			status: 400
		});
	}

	if (!body) {
		return new Response('Empty body', {
			status: 400
		});
	}

	const existingContent = (await authedPb.collection('tags').getOne(body.id)) as ITag;

	try {
		await authedPb.collection('tags').update(body.id, {
			contents: {
				pokemon: existingContent.contents.pokemon.concat(body.contents.pokemon)
			}
		});
	} catch (err) {
		error(JSON.stringify(err), 'FailedToAppendToTag');
		return new Response('Failed to update tag', {
			status: 500
		});
	}

	return new Response('Added', { status: 200 });
}

export async function DELETE({ request }) {
	const authedPb = await validateAuth(request);
	if (!authedPb) {
		return new Response('Not authorised', { status: 401 });
	}

	let body: { id: string; contents: ITagContents } | undefined;
	try {
		body = await request.json();
	} catch (err) {
		warn('Failed to parse JSON from request body', request);
		return new Response('Invalid body', {
			status: 400
		});
	}

	if (!body) {
		return new Response('Empty body', {
			status: 400
		});
	}

	const existingContent = (await authedPb.collection('tags').getOne(body.id)) as ITag;

	try {
		await authedPb.collection('tags').update(body.id, {
			contents: {
				pokemon: existingContent.contents.pokemon.filter((a) => {
					return body?.contents.pokemon.includes({ id: a.id });
				})
			}
		});
	} catch (err) {
		error(JSON.stringify(err), 'FailedToRemoveFromTag');
		return new Response('Failed to remove item from tag', {
			status: 500
		});
	}

	return new Response('Removed', { status: 200 });
}
