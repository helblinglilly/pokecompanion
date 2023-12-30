import { error, logToAxiom, warn } from '$lib/log';
import isStringToxic from '$lib/server/toxic.js';
import { validateAuth } from '../helpers.js';
import type { ITagRequestBody, ITagUpdateBody } from '$lib/types/ITags.js';

export async function POST({ request, cookies }) {
	const authedPb = await validateAuth(request, cookies);
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
			isPrivate: body.isPrivate,
			showGenderAndShiny: body.showGenderAndShiny
		});
		logToAxiom(
			{
				action: 'createdTag',
				tag: { name: body.name, owner: authedPb.authStore.model?.id }
			},
			request,
			cookies
		);
	} catch (err) {
		error(`Failed to create new tag ${err}`, '', JSON.stringify(request));
		return new Response('Failed to create new tag', {
			status: 500
		});
	}

	return new Response('created');
}

export async function PATCH({ request, cookies }) {
	const authedPb = await validateAuth(request, cookies);
	if (!authedPb || !authedPb.authStore.model) {
		return new Response('Not authorised', { status: 401 });
	}

	let body: ITagUpdateBody | undefined;
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
			logToAxiom(
				{
					action: 'updatedTag',
					tag: { name: entry.name, owner: authedPb.authStore.model?.id }
				},
				request,
				cookies
			);
		});
	} catch (err) {
		error(JSON.stringify(err), 'FailedToUpdateTag');
		return new Response(`Failed to update tag`, {
			status: 500
		});
	}

	return new Response('Ok', { status: 200 });
}

export async function DELETE({ request, cookies }) {
	const authedPb = await validateAuth(request, cookies);
	if (!authedPb || !authedPb.authStore.model) {
		return new Response('Not authorised', { status: 401 });
	}

	let body: { id: string } | undefined;
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

	try {
		await authedPb.collection('tags').delete(body.id);
		logToAxiom(
			{ action: 'deletedTag', tag: { id: body.id, owner: authedPb.authStore.model?.id } },
			request,
			cookies
		);
		return new Response('Deleted');
	} catch (err) {
		error(JSON.stringify(err), 'FailedToDeleteTag');
		return new Response(`Failed to delete tag`, {
			status: 500
		});
	}
}
