import { error, warn } from '$lib/log';
import isStringToxic from '$lib/utils/toxic.js';
import { validateAuth } from '../helpers.js';
import type { ITagRequestBody } from '$lib/types/ITags.js';

export async function POST({ request }) {
	const authedPb = await validateAuth(request);
	if (!authedPb) {
		return new Response('Not authorised', { status: 401 });
	}

	let body: ITagRequestBody | undefined;
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

	/*
	It'd be nice to only check public tags if they're toxic
	But then we have to add a validation step if we allow users to make tags
	public/private. And rn I will forget about it
	*/
	const isToxic = await isStringToxic(body.name);
	if (isToxic) {
		return new Response('Failed to create new tag', {
			status: 500
		});
	}

	try {
		await authedPb.collection('tags').create({
			owner: authedPb.authStore.model?.id,
			name: body.name,
			contents: body.initialContent ? body.initialContent : {},
			isPrivate: body.isPrivate
		});
	} catch (err) {
		error(`Failed to create new tag ${err}`, '', '', JSON.stringify(request));
		return new Response('Failed to create new tag', {
			status: 500
		});
	}

	return new Response('cool');
}
