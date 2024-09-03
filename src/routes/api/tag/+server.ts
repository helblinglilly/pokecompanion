import { validateAuth } from '../helpers.js';
import { Logger } from '$lib/log.js';
import type { ITagDatabase, ITagInitial } from './types.js';
import isStringToxic from '$/lib/server/toxic.js';

/**
 * Returns the Tags for the current user
 */
export async function GET({ request, cookies, platform }) {
	const authedPb = await validateAuth(request, cookies);
	if (!authedPb) {
		return new Response(JSON.stringify([]), { status: 401 });
	}

	try {
		const tags = await authedPb.collection('tags').getFullList({
			sort: '-created',
			filter: `owner.id ~ "${authedPb.authStore.model?.id}"`
		}) as ITagDatabase[];

		return new Response(JSON.stringify(tags), {
			status: 200,
		})
	} catch (err) {
		platform?.context.waitUntil(
			Logger.error(
				Logger.ErrorClasses.TagOperation,
				Logger.buildError(err),
				{
					context: 'Failed to get Tags by user',
					user: cookies.get('remember-token'),
				}
			)
		)

		return new Response('Internal error', {
			status: 500
		})
	}
}

/**
 * Create a new tag
 */
export async function POST({ request, cookies, platform }) {
	const authedPb = await validateAuth(request, cookies);
	if (!authedPb) {
		return new Response('Not authorised', { status: 401 });
	}

	let body: Readonly<ITagInitial> | undefined;
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

	const isToxic = await isStringToxic(body.name);
	if (isToxic) {
		Logger.info('Caught Toxic tag name', {
			context: 'Create new tag',
			name: body.name
		} )
		return new Response('Failed to create new tag', {
			status: 500
		});
	}

	try {
		await authedPb.collection('tags').create({
			owner: authedPb.authStore.model?.id,
			sortKey: 'added',
			sortOrder: 'desc',
			...body
		});
		platform?.context.waitUntil(
			Logger.addPageAction('TagCreated', 'Created a new tag', {
				name: body.name,
				user: authedPb.authStore.model?.id
			})
		)
	} catch (err) {
		platform?.context.waitUntil(
			Logger.error(
				Logger.ErrorClasses.TagOperation,
				Logger.buildError(err),
				{
					context: 'Creating a new tag',
					errorMessage: 'Failed to insert a new tag into the DB',
					user: cookies.get('remember-token'),
					name: body.name
				}
			)
		)
		return new Response('Failed to create new tag', {
			status: 500
		});
	}

	return new Response('Created');
	
	/*

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
	*/
}