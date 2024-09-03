import { Logger } from "$/lib/log";
import isStringToxic from "$/lib/server/toxic";
import { validateAuth } from "../../helpers";
import type { ITagMeta } from "../types";

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

	let body: Partial<ITagMeta> | undefined;
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

	try {
		await authedPb.collection('tags').update(params.tagId, {
			contents: {
				...body
			}
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

	return new Response(`Updated ${params.tagId}`, { status: 202 })
}

// export async function DELETE({ request, cookies, platform }) {
// 	const authedPb = await validateAuth(request, cookies);

// 	if (!authedPb) {
// 		return new Response('Not authorised', { status: 401 });
// 	}

// 	let body: { id: string; contents: ITagContents } | undefined;
// 	try {
// 		body = await request.json();
// 	} catch (err) {
// 		platform?.context.waitUntil(
// 			Logger.error(
// 				Logger.ErrorClasses.TagOperation,
// 				Logger.buildError(err),
// 				{
// 					context: 'Deleting a tag',
// 					errorMessage: 'Failed to parse JSON from request body',
// 					user: cookies.get('remember-token')
// 				}
// 			)
// 		)

// 		return new Response('Invalid body', {
// 			status: 400
// 		});
// 	}

// 	if (!body) {
// 		return new Response('Empty body', {
// 			status: 400
// 		});
// 	}

// 	const existingContent = (await authedPb.collection('tags').getOne(body.id)) as ITag;

// 	const newContents = {
// 		pokemon: existingContent.contents.pokemon?.filter((existing) => {
// 			return (
// 				body?.contents.pokemon?.find((req) => {
// 					return req.id !== existing.id;
// 				}) !== undefined
// 			);
// 		}),
// 		move: existingContent.contents.move?.filter((existing) => {
// 			return (
// 				body?.contents.move?.find((req) => {
// 					return req.id !== existing.id;
// 				}) !== undefined
// 			);
// 		})
// 	};
// 	try {
// 		await authedPb.collection('tags').update(body.id, {
// 			contents: {
// 				pokemon: newContents.pokemon,
// 				move: newContents.move
// 			}
// 		});
// 	} catch (err) {
// 		platform?.context.waitUntil(
// 			Logger.error(
// 				Logger.ErrorClasses.TagOperation,
// 				Logger.buildError(err),
// 				{
// 					context: 'Removing entries from tag',
// 					errorMessage: 'DB Operation: Failed to update tag to remove existing entries from it',
// 					user: cookies.get('remember-token'),
// 					tag: body.id
// 				}
// 			)
// 		)

// 		return new Response('Failed to remove item from tag', {
// 			status: 500
// 		});
// 	}

// 	return new Response(JSON.stringify(newContents), { status: 200 });
// }

// export async function PATCH({ request, cookies, platform }) {
// 	const authedPb = await validateAuth(request, cookies);

// 	if (!authedPb) {
// 		return new Response('Not authorised', { status: 401 });
// 	}

// 	let body:
// 		| {
// 				id: string;
// 				contents: ITagContents;
// 				name: string;
// 				isPrivate: boolean;
// 				showGenderAndShiny: boolean;
// 				description: string;
// 				isHiddenAcrossSite: boolean;
// 		  }
// 		| undefined;

// 	try {
// 		body = await request.json();
// 	} catch (err) {
// 		platform?.context.waitUntil(
// 			Logger.error(
// 				Logger.ErrorClasses.TagOperation,
// 				Logger.buildError(err),
// 				{
// 					context: 'Updating a tag',
// 					errorMessage: 'Failed to parse JSON from request body',
// 					user: cookies.get('remember-token')
// 				}
// 			)
// 		)
// 		return new Response('Invalid body', {
// 			status: 400
// 		});
// 	}

// 	if (!body) {
// 		return new Response('Empty body', {
// 			status: 400
// 		});
// 	}

// 	if (
// 		!body.contents ||
// 		!body.name ||
// 		body.isPrivate === undefined ||
// 		body.showGenderAndShiny === undefined ||
// 		!body.description ||
// 		body.isHiddenAcrossSite === undefined
// 	) {
// 		return new Response(JSON.stringify({ error: 'Invalid body', request: body }), {
// 			status: 400
// 		});
// 	}

// 	if (await isStringToxic(body.name) || await isStringToxic(body.description)){
// 		return new Response(JSON.stringify({ error: 'Invalid body', request: body }), {
// 			status: 400
// 		});	
// 	}

// 	try {
// 		await authedPb.collection('tags').update(body.id, {
// 			contents: {
// 				pokemon: body.contents.pokemon,
// 				move: body.contents.move
// 			},
// 			name: body.name,
// 			isPrivate: body.isPrivate,
// 			showGenderAndShiny: body.showGenderAndShiny,
// 			description: body.description,
// 			isHiddenAcrossSite: body.isHiddenAcrossSite
// 		});
// 	} catch (err) {
// 		platform?.context.waitUntil(
// 			Logger.error(
// 				Logger.ErrorClasses.TagOperation,
// 				Logger.buildError(err),
// 				{
// 					context: 'Updating a tag',
// 					errorMessage: 'DB Operation to update a tag has failed',
// 					user: cookies.get('remember-token'),
// 					tag: body.id
// 				}
// 			)
// 		)
// 		return new Response('Failed to update tag', {
// 			status: 500
// 		});
// 	}

// 	return new Response(JSON.stringify(body), { status: 200 });
// }