import isStringToxic from '$lib/server/toxic.js';
import { validateAuth } from '../helpers.js';
import type { ITagRequestBody, ITagUpdateBody } from '$lib/types/ITags.js';
import { Logger } from '$lib/log.js';

/**
 * Returns the Tags for the current user. Similar to 
 * @param param0 
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
		});

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

export async function POST({ request, cookies, platform }) {
	const authedPb = await validateAuth(request, cookies);
	if (!authedPb) {
		return new Response('Not authorised', { status: 401 });
	}

	let body: ITagRequestBody | undefined;
	try {
		body = await request.json();
	} catch (err) {
		platform?.context.waitUntil(
			Logger.error(
				Logger.ErrorClasses.TagOperation,
				Logger.buildError(err),
				{
	
					context: 'Creating a new tag',
					errorMessage: 'Failed to parse JSON from request body when trying to create a new tag',
					user: cookies.get('remember-token'),
					referrer: request.referrer
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

	/*
	It'd be nice to only check public tags if they're toxic
	But then we have to add a validation step if we allow users to make tags
	public/private. And rn I will forget about it
	*/
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
			name: body.name,
			contents: body.initialContent ? body.initialContent : {},
			isPrivate: body.isPrivate,
			showGenderAndShiny: body.showGenderAndShiny,
			sortKey: 'added',
			sortOrder: 'desc'
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

	return new Response('created');
}

export async function PATCH({ request, cookies, platform }) {
	const authedPb = await validateAuth(request, cookies);
	if (!authedPb || !authedPb.authStore.model) {
		return new Response('Not authorised', { status: 401 });
	}

	let body: ITagUpdateBody | undefined;
	try {
		body = await request.json();
	} catch (err) {
		platform?.context.waitUntil(
			Logger.error(
				Logger.ErrorClasses.TagOperation,
				Logger.buildError(err),
				{
					context: 'Updating a Tag',
					errorMessage: 'Failed to parse JSON from request',
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

	if (!body.updatedTags || body.updatedTags.length === 0) {
		return new Response('Empty payload', { status: 400 });
	}

	try {
		body.updatedTags.forEach(async (entry) => {
			const isToxic = await isStringToxic(entry.name);
			if (isToxic) {
				throw new Error(`Toxic tag name: ${entry.name}`);
			}

			await authedPb.collection('tags').update(entry.id, {
				owner: authedPb.authStore.model?.id,
				name: entry.name,
				contents: entry.contents,
				isPrivate: entry.isPrivate,
				showGenderAndShiny: entry.showGenderAndShiny
			});

			platform?.context.waitUntil(
				Logger.addPageAction('TagUpdated', 'User has updated a tag', {
					name: entry.name,
					user: authedPb.authStore.model?.id
				})
			)
		});
	} catch (err) {
		platform?.context.waitUntil(
			Logger.error(
				Logger.ErrorClasses.TagOperation,
				Logger.buildError(err),
				{
					context: 'Updating a tag',
					errorMessage: 'DB operation to update a tag has failed',
					body: JSON.stringify(body),
					user: cookies.get('remember-token')
				}
			)
		)
		return new Response(`Failed to update tag`, {
			status: 500
		});
	}

	return new Response('Ok', { status: 200 });
}

export async function DELETE({ request, cookies, platform }) {
	const authedPb = await validateAuth(request, cookies);
	if (!authedPb || !authedPb.authStore.model) {
		return new Response('Not authorised', { status: 401 });
	}

	let body: { id: string } | undefined;
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

	try {
		await authedPb.collection('tags').delete(body.id);
		
		platform?.context.waitUntil(
			Logger.addPageAction('TagUpdated', 'User has deleted a tag', {
				id: body.id,
				user: authedPb.authStore.model?.id
			})
		)

		return new Response('Deleted');
	} catch (err) {
		platform?.context.waitUntil(
			Logger.error(
				Logger.ErrorClasses.TagOperation,
				Logger.buildError(err),
				{
					context: 'Deleting a tag',
					errorMessage: 'DB Operation to delete tag has failed',
					user: cookies.get('remember-token'),
					id: body.id
				}
			)
		)

		return new Response(`Failed to delete tag`, {
			status: 500
		});
	}
}
