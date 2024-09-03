import { Logger } from "$/lib/log";
import type { IRecordPokemon } from "$/lib/types/IPokemon";
import { validateAuth } from "$/routes/api/helpers";
import type { RecordTag } from "../../types";

/**
 * Remove a Pokemon from a tag
 */
export async function DELETE({ request, cookies, platform, params }){
	const authedPb = await validateAuth(request, cookies);

	if (!authedPb) {
		return new Response('Not authorised', { status: 401 });
	}

	let body: IRecordPokemon | undefined;
	try {
		body = await request.json();
	} catch (err) {
		platform?.context.waitUntil(
			Logger.error(
				Logger.ErrorClasses.TagOperation,
				Logger.buildError(err),
				{
					context: 'Deleting a Pokemon from a tag',
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
    
    function isIRecordPokemonKey(key: string): key is keyof IRecordPokemon {
        return key in ({} as IRecordPokemon);
    }

    const updatedPokemonEntry = tag.contents.pokemon?.filter((pokemon) => {
        return Object.keys(body).every((key) => isIRecordPokemonKey(key) && pokemon[key] === body[key]);
    })

	try {
		await authedPb.collection('tags').update(params.tagId, {
			contents: {
                ...tag.contents,
                pokemon: {
                    ...updatedPokemonEntry
                }
            }
		});
	} catch (err) {
		platform?.context.waitUntil(
			Logger.error(
				Logger.ErrorClasses.TagOperation,
				Logger.buildError(err),
				{
					context: 'Deleting a Pokemon from a Tag',
					errorMessage: 'DB Operation: Failed to update tag with a Pokemon removed from its contents',
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