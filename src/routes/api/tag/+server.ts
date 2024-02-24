import { error, warn } from '$lib/log';
import { validateAuth } from '../helpers.js';
import type { ITag, ITagContents } from '$lib/types/ITags.js';

export async function POST({ request, cookies }) {
	const authedPb = await validateAuth(request, cookies);
	if (!authedPb) {
		return new Response('Not authorised', { status: 401 });
	}

	let body: { id: string; contents: ITagContents } | undefined;
	try {
		body = await request.json();
	} catch (err) {
		warn('Failed to parse JSON from request body', `FailedPostTag`, {
			cookies: cookies,
			request: request
		});
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

export async function DELETE({ request, cookies }) {
	const authedPb = await validateAuth(request, cookies);

	if (!authedPb) {
		return new Response('Not authorised', { status: 401 });
	}

	let body: { id: string; contents: ITagContents } | undefined;
	try {
		body = await request.json();
	} catch (err) {
		warn('Failed to parse JSON from request body', `FailedDeleteTag`, {
			cookies: cookies,
			request: request
		});
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

	const newContents = {
		pokemon: existingContent.contents.pokemon.filter((existing) => {
			return (
				body?.contents.pokemon.find((req) => {
					return req.id !== existing.id;
				}) !== undefined
			);
		})
	};
	try {
		await authedPb.collection('tags').update(body.id, {
			contents: {
				pokemon: newContents.pokemon
			}
		});
	} catch (err) {
		error(JSON.stringify(err), 'FailedToRemoveFromTag');
		return new Response('Failed to remove item from tag', {
			status: 500
		});
	}

	return new Response(JSON.stringify(newContents), { status: 200 });
}

export async function PATCH({ request, cookies }) {
	const authedPb = await validateAuth(request, cookies);

	if (!authedPb) {
		return new Response('Not authorised', { status: 401 });
	}

	let body:
		| {
				id: string;
				contents: ITagContents;
				name: string;
				isPrivate: boolean;
				showGenderAndShiny: boolean;
		  }
		| undefined;

	try {
		body = await request.json();
	} catch (err) {
		warn('Failed to parse JSON from request body', `FailedPatchTag`, {
			cookies: cookies,
			request: request
		});
		return new Response('Invalid body', {
			status: 400
		});
	}

	if (!body) {
		return new Response('Empty body', {
			status: 400
		});
	}

	if (
		!body.contents ||
		body.contents.pokemon.length === undefined ||
		!body.name ||
		body.isPrivate === undefined ||
		body.showGenderAndShiny === undefined
	) {
		return new Response(JSON.stringify({ error: 'Invalid body', request: body }), {
			status: 400
		});
	}

	try {
		await authedPb.collection('tags').update(body.id, {
			contents: {
				pokemon: body.contents.pokemon
			},
			name: body.name,
			isPrivate: body.isPrivate,
			showGenderAndShiny: body.showGenderAndShiny
		});
	} catch (err) {
		error(JSON.stringify(err), 'FailedToUpdateTag');
		return new Response('Failed to update tag', {
			status: 500
		});
	}

	return new Response(JSON.stringify(body), { status: 200 });
}
