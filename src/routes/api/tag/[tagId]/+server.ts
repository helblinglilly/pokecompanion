import { Logger } from "$/lib/log";
import isStringToxic from "$/lib/server/toxic";
import { PUBLIC_POCKETBASE_URL } from "$env/static/public";
import Pocketbase from 'pocketbase';
import { validateAuth } from "../../helpers";
import type { ITagDatabase, ITagMeta } from "../types";

/**
 * Delete a specific tag
 */
export async function DELETE({ request, cookies, platform, params }) {
	const authedPb = await validateAuth(request, cookies);

	if (!authedPb) {
		return new Response('Not authorised', { status: 401 });
	}

	try {
		await authedPb.collection('tags').delete(params.tagId);
	} catch (err) {
		platform?.context.waitUntil(
			Logger.error(
				Logger.ErrorClasses.TagOperation,
				Logger.buildError(err),
				{
					context: 'Deleting a tag',
					errorMessage: 'DB Operation: Failed to delete a tag',
					user: cookies.get('remember-token'),
					tags: params.tagId
				}
			)
		)

		return new Response('Failed to delete tag', {
			status: 500
		});
	}

	return new Response(`Deleted ${params.tagId}`);
}

/**
 * Update meta information about a tag
 */
export async function PATCH({ request, cookies, platform, params }) {
	const authedPb = await validateAuth(request, cookies);

	if (!authedPb) {
		return new Response('Not authorised', { status: 401 });
	}

	let body: Partial<ITagMeta & { content: any }> | undefined;
	try {
		body = await request.json();
	} catch(err){
		platform?.context.waitUntil(
			Logger.error(
				Logger.ErrorClasses.TagOperation,
				Logger.buildError(err),
				{
					context: 'Patching meta data about a tag',
					errorMessage: 'Failed to parse JSON from request body',
					user: cookies.get('remember-token')
				}
			)
		)	

		return new Response('Invalid body', { status: 400 })
	}

	if (!body){
		return new Response('Empty body', { status: 400 });
	}

	const toxicPromises: Promise<boolean>[] = [];
	if (body.name){
		toxicPromises.push(isStringToxic(body.name))
	}
	if (body.description){
		toxicPromises.push(isStringToxic(body.description))
	}

	if (toxicPromises.length > 0){
		const toxicResults = await Promise.all(toxicPromises);
		if (toxicResults.some((result) => result)){
			platform?.context.waitUntil(
				Logger.info('Caught Toxic tag entry', {
					context: 'Patch tag',
					name: body.name,
					description: body.description
				} )
			)
			return new Response('Internal server error', { status: 500 });
		}
	}

	const withoutContent = { ...body };
	if (typeof withoutContent['content'] !== undefined){
		delete withoutContent.content;
	}

	try {
		await authedPb.collection('tags').update(params.tagId, {
			...withoutContent
		});
	} catch(err){
		platform?.context.waitUntil(
			Logger.error(
				Logger.ErrorClasses.TagOperation,
				Logger.buildError(err),
				{
					context: 'Patching meta data about a tag',
					errorMessage: 'DB Operation: Failed to update the tag',
					user: cookies.get('remember-token')
				}
			)
		)		

		return new Response('Internal server error', { status: 500 })
	}

	try {
		const fullUpdatedTag = await authedPb.collection('tags').getOne(params.tagId);
		return new Response(JSON.stringify(fullUpdatedTag), { status: 200 })
	} catch(err){
		platform?.context.waitUntil(
			Logger.error(
				Logger.ErrorClasses.TagOperation,
				Logger.buildError(err),
				{
					context: 'Patching meta data about a tag',
					errorMessage: 'Tag has been updated but failed to retrieve it for confirmation',
					user: cookies.get('remember-token')
				}
			)
		)		
		return new Response(JSON.stringify({}), { status: 200 })
	}
}

/**
 * Read a specific tag
 */
export async function GET({ request, cookies, platform, params }) {
	let pb = new Pocketbase(PUBLIC_POCKETBASE_URL);

	const authedPb = await validateAuth(request, cookies);
	if (authedPb) {
		pb = authedPb;
	}

	try {
		const tags = await pb.collection('tags').getOne(params.tagId) as ITagDatabase

		return new Response(JSON.stringify(tags), {
			status: 200,
		})
	} catch (err) {
		platform?.context.waitUntil(
			Logger.error(
				Logger.ErrorClasses.TagOperation,
				Logger.buildError(err),
				{
					context: 'Failed to get a specific tag',
					user: cookies.get('remember-token'),
					tagId: params.tagId
				}
			)
		)

		return new Response('Internal error', {
			status: 500
		})
	}
}