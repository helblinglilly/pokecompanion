import { Logger } from '$/lib/log';
import isStringToxic from '$/lib/server/toxic';
import { validateAuth } from '../../helpers';
import type { ITagMeta } from '../types';

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
	} catch (err) {
		platform?.context.waitUntil(
			Logger.error(Logger.ErrorClasses.TagOperation, Logger.buildError(err), {
				context: 'Patching meta data about a tag',
				errorMessage: 'Failed to parse JSON from request body',
				user: cookies.get('remember-token')
			})
		);

		return new Response('Invalid body', { status: 400 });
	}

	if (!body) {
		return new Response('Empty body', { status: 400 });
	}

	const toxicPromises: Promise<boolean>[] = [];
	if (body.name) {
		toxicPromises.push(isStringToxic(body.name));
	}
	if (body.description) {
		toxicPromises.push(isStringToxic(body.description));
	}

	if (toxicPromises.length > 0) {
		const toxicResults = await Promise.all(toxicPromises);
		if (toxicResults.some((result) => result)) {
			platform?.context.waitUntil(
				Logger.info('Caught Toxic tag entry', {
					context: 'Patch tag',
					name: body.name,
					description: body.description
				})
			);
			return new Response('Internal server error', { status: 500 });
		}
	}

	const withoutContent = { ...body };
	if (typeof withoutContent['content'] !== undefined) {
		delete withoutContent.content;
	}

	try {
		await authedPb.collection('tags').update(params.tagId, {
			...withoutContent
		});
	} catch (err) {
		platform?.context.waitUntil(
			Logger.error(Logger.ErrorClasses.TagOperation, Logger.buildError(err), {
				context: 'Patching meta data about a tag',
				errorMessage: 'DB Operation: Failed to update the tag',
				user: cookies.get('remember-token')
			})
		);

		return new Response('Internal server error', { status: 500 });
	}

	try {
		const fullUpdatedTag = await authedPb.collection('tags').getOne(params.tagId);
		return new Response(JSON.stringify(fullUpdatedTag), { status: 200 });
	} catch (err) {
		platform?.context.waitUntil(
			Logger.error(Logger.ErrorClasses.TagOperation, Logger.buildError(err), {
				context: 'Patching meta data about a tag',
				errorMessage: 'Tag has been updated but failed to retrieve it for confirmation',
				user: cookies.get('remember-token')
			})
		);
		return new Response(JSON.stringify({}), { status: 200 });
	}
}
