import { Logger } from "$/lib/log";
import { lastPokedexEntry } from "$/lib/stores/domain";
import { validateAuth } from "$/routes/api/helpers";
import type { ITagMove, RecordTag } from "../../types";

/**
 * Remove a Move from a tag
 */
export async function DELETE({ request, cookies, platform, params }){
	const authedPb = await validateAuth(request, cookies);

	if (!authedPb) {
		return new Response('Not authorised', { status: 401 });
	}

	let body: ITagMove | undefined;
	try {
		body = await request.json();
	} catch (err) {
		platform?.context.waitUntil(
			Logger.error(
				Logger.ErrorClasses.TagOperation,
				Logger.buildError(err),
				{
					context: 'Deleting a Move from a tag',
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

	const tag = (await authedPb.collection('tags').getOne(params.tagId)) as RecordTag;

	try {
		await authedPb.collection('tags').update(params.tagId, {
			contents: {
                ...tag.contents,
                move: tag.contents.move?.filter((a) => a.id !== body.id)
            }
		});
	} catch (err) {
		platform?.context.waitUntil(
			Logger.error(
				Logger.ErrorClasses.TagOperation,
				Logger.buildError(err),
				{
					context: 'Deleting a Move from a Tag',
					errorMessage: 'DB Operation: Failed to update tag with a Move removed from its contents',
					user: cookies.get('remember-token'),
					tag: params.tagId
				}
			)
		)

		return new Response('Failed to remove item from tag', {
			status: 500
		});
	}

	return new Response('Ok', { status: 200 });
}

/**
 * Add a new Move to a tag
 */
export async function POST({ request, cookies, platform, params }){
	const authedPb = await validateAuth(request, cookies);

	if (!authedPb) {
		return new Response('Not authorised', { status: 401 });
	}

	let body: ITagMove | undefined;
	try {
		body = await request.json();
	} catch (err) {
		platform?.context.waitUntil(
			Logger.error(
				Logger.ErrorClasses.TagOperation,
				Logger.buildError(err),
				{
					context: 'Deleting a Move from a tag',
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

	if (body.id < 1 || body.id > lastPokedexEntry){
		return new Response(`Invalid ID. Must be between 1 and ${lastPokedexEntry}`, { status: 400 });
	}

	const tag = (await authedPb.collection('tags').getOne(params.tagId)) as RecordTag;

	try {
		await authedPb.collection('tags').update(params.tagId, {
			contents: {
                ...tag.contents,
                move: {
                    ...tag.contents.move,
                    ...body
                }
            }
		});
	} catch (err) {
		platform?.context.waitUntil(
			Logger.error(
				Logger.ErrorClasses.TagOperation,
				Logger.buildError(err),
				{
					context: 'Deleting a Move from a Tag',
					errorMessage: 'DB Operation: Failed to update tag with a Move removed from its contents',
					user: cookies.get('remember-token'),
					tag: params.tagId
				}
			)
		)

		return new Response('Failed to remove item from tag', {
			status: 500
		});
	}

	return new Response('Ok', { status: 200 });
}

