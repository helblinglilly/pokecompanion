import { Logger } from "$/lib/log";
import isStringToxic from "$/lib/server/toxic";
import type { IBasePokemon } from "$/lib/types/ITeams";
import { validateAuth } from "$/routes/api/helpers";

export async function PATCH({ request, cookies, platform, params}) {
    const authedPb = await validateAuth(request, cookies);

    if (!authedPb){
        return new Response('Not authorised', { status: 401 });
    }

    let body: { pokemon: Partial<IBasePokemon> };

    try {
        body = await request.json();
    } catch(err){
        platform?.context.waitUntil(
            Logger.error(
                Logger.ErrorClasses.TeamOperation,
                Logger.buildError(err),
                {
                    context: 'Editing a Team Pokémon',
                    errorMessage: 'Failed to parse JSON from request body',
                    user: cookies.get('remember-token')
                }
            )
        )
        return new Response('Invalid body', { status: 400 })
    }

    if (!body || !body.pokemon){
        return new Response('Empty body', { status: 400 });
    }

    const isNicknameToxic = await isStringToxic(body.pokemon.nickname ?? '');

    if (body.pokemon.national_dex === -1 || isNicknameToxic){
        return new Response('Invalid body', { status: 400 })
    }

    try {
        const { id } = await authedPb.collection('team_pokemon').update(params.pokemonId, {
            ...body.pokemon,
            position: 6,
            owner: authedPb.authStore.model?.id,
            team: params.teamId
        })

        const existingBench = await authedPb.collection('teams').getOne(params.teamId);
        
        await authedPb.collection('teams').update(params.teamId, {
            bench: [...existingBench.bench, id]
        })
 
    } catch(err){
        Logger.error(
            Logger.ErrorClasses.TeamOperation,
            Logger.buildError(err),
            {
                context: 'Editing a Team Pokemon',
                errorMessage: 'Failed to update DB entries',
                user: cookies.get('remember-token')
            }
        )
        return new Response('Internal error', { status: 500})
    }

   return new Response('Ok', {
        status: 200
    })

}