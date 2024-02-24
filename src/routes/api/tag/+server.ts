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
	const existingPokemon = existingContent.contents.pokemon ?? [];
	const existingMoves = existingContent.contents.move ?? [];
	try {
		await authedPb.collection('tags').update(body.id, {
			contents: {
				pokemon: existingPokemon.concat(body.contents.pokemon ?? []),
				move: existingMoves.concat(body.contents.move ?? [])
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
		warn('Failed to parse JSON from request body', `FailedDeleteFromTag`, {
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
		pokemon: existingContent.contents.pokemon?.filter((existing) => {
			return (
				body?.contents.pokemon?.find((req) => {
					return req.id !== existing.id;
				}) !== undefined
			);
		}),
		move: existingContent.contents.move?.filter((existing) => {
			return (
				body?.contents.move?.find((req) => {
					return req.id !== existing.id;
				}) !== undefined
			);
		})
	};
	try {
		await authedPb.collection('tags').update(body.id, {
			contents: {
				pokemon: newContents.pokemon,
				move: newContents.move
			}
		});
	} catch (err) {
		error(JSON.stringify(err), 'FailedToRemoveFromTag', {
			pokemon: body.contents.pokemon,
			move: body.contents.move
		});
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
				pokemon: body.contents.pokemon,
				move: body.contents.move
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
