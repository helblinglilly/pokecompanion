import { validateAuth } from '../helpers.js';
import type { ITag, ITagContents } from '$lib/types/ITags.js';
import { Logger } from '$lib/log.js';
import isStringToxic from '$/lib/server/toxic.js';

export async function POST({ request, cookies, platform }) {
	const authedPb = await validateAuth(request, cookies);
	if (!authedPb) {
		return new Response('Not authorised', { status: 401 });
	}

	let body: { id: string; contents: ITagContents } | undefined;
	try {
		body = await request.json();
	} catch (err) {
		platform?.context.waitUntil(
			Logger.error(
				Logger.ErrorClasses.TagOperation,
				Logger.buildError(err),
				{
					context: 'Creating a tag',
					errorMessage: 'Failed to parse JSON from request body',
					user: cookies.get('remember-token')
				}
			)
		)
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
		platform?.context.waitUntil(
			Logger.error(
				Logger.ErrorClasses.TagOperation,
				Logger.buildError(err),
				{
					context: 'Updating a tag',
					errorMessage: 'DB Operation to update a tag has failed',
					user: cookies.get('remember-token'),
					id: body.id
				}
			)
		)

		return new Response('Failed to update tag', {
			status: 500
		});
	}

	return new Response('Added', { status: 200 });
}

export async function DELETE({ request, cookies, platform }) {
	const authedPb = await validateAuth(request, cookies);

	if (!authedPb) {
		return new Response('Not authorised', { status: 401 });
	}

	let body: { id: string; contents: ITagContents } | undefined;
	try {
		body = await request.json();
	} catch (err) {
		platform?.context.waitUntil(
			Logger.error(
				Logger.ErrorClasses.TagOperation,
				Logger.buildError(err),
				{
					context: 'Deleting a tag',
					errorMessage: 'Failed to parse JSON from request body',
					user: cookies.get('remember-token')
				}
			)
		)

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
		platform?.context.waitUntil(
			Logger.error(
				Logger.ErrorClasses.TagOperation,
				Logger.buildError(err),
				{
					context: 'Removing entries from tag',
					errorMessage: 'DB Operation: Failed to update tag to remove existing entries from it',
					user: cookies.get('remember-token'),
					tag: body.id
				}
			)
		)

		return new Response('Failed to remove item from tag', {
			status: 500
		});
	}

	return new Response(JSON.stringify(newContents), { status: 200 });
}

export async function PATCH({ request, cookies, platform }) {
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
				description: string;
		  }
		| undefined;

	try {
		body = await request.json();
	} catch (err) {
		platform?.context.waitUntil(
			Logger.error(
				Logger.ErrorClasses.TagOperation,
				Logger.buildError(err),
				{
					context: 'Updating a tag',
					errorMessage: 'Failed to parse JSON from request body',
					user: cookies.get('remember-token')
				}
			)
		)
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
		body.showGenderAndShiny === undefined ||
		!body.description
	) {
		return new Response(JSON.stringify({ error: 'Invalid body', request: body }), {
			status: 400
		});
	}

	if (await isStringToxic(body.name) || await isStringToxic(body.description)){
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
			showGenderAndShiny: body.showGenderAndShiny,
			description: body.description,
		});
	} catch (err) {
		platform?.context.waitUntil(
			Logger.error(
				Logger.ErrorClasses.TagOperation,
				Logger.buildError(err),
				{
					context: 'Updating a tag',
					errorMessage: 'DB Operation to update a tag has failed',
					user: cookies.get('remember-token'),
					tag: body.id
				}
			)
		)
		return new Response('Failed to update tag', {
			status: 500
		});
	}

	return new Response(JSON.stringify(body), { status: 200 });
}
