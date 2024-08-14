import { Logger } from "$/lib/log";
import isStringToxic from "$/lib/server/toxic.js";
import type { IBasePokemon, IRecordTeam } from "$/lib/types/ITeams";
import { validateAuth } from "$/routes/api/helpers";

export async function POST({ request, cookies, platform, params}) {
    const authedPb = await validateAuth(request, cookies);

    if (!authedPb){
        return new Response('Not authorised', { status: 401 });
    }

    let body: { pokemon: IBasePokemon };

    try {
        body = await request.json();
    } catch(err){
        platform?.context.waitUntil(
            Logger.error(
                Logger.ErrorClasses.TeamOperation,
                Logger.buildError(err),
                {
                    context: 'Adding a new Pokémon to a box',
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
        const { id } = await authedPb.collection('team_pokemon').create({
            nickname: body.pokemon.nickname,
            national_dex: body.pokemon.national_dex,
            variety: '',
            gender: null,
            shiny: false,
            ability: body.pokemon.ability,
            move1: body.pokemon.move1,
            move2: body.pokemon.move2,
            move3: body.pokemon.move3,
            move4: body.pokemon.move4,
            position: 6,
            owner: authedPb.authStore.model?.id,
            team: params.id
        })

        const existingBench = await authedPb.collection('teams').getOne(params.id);
        
        await authedPb.collection('teams').update(params.id, {
            bench: [...existingBench.bench, id]
        })
 
    } catch(err){
        Logger.error(
            Logger.ErrorClasses.TeamOperation,
            Logger.buildError(err),
            {
                context: 'Creating a new Pokemon',
                errorMessage: 'Failed to create new DB entries',
                user: cookies.get('remember-token')
            }
        )
        return new Response('Internal error', { status: 500})
    }

   return new Response('Ok', {
        status: 200
    })

}

export async function DELETE({ request, cookies, platform, params}) {
    const authedPb = await validateAuth(request, cookies);

    if (!authedPb){
        return new Response('Not authorised', { status: 401 });
    }

    let body: { pokemonId: string };

    try {
        body = await request.json();
    } catch(err){
        platform?.context.waitUntil(
            Logger.error(
                Logger.ErrorClasses.TeamOperation,
                Logger.buildError(err),
                {
                    context: 'Deleting a new Team Pokémon',
                    errorMessage: 'Failed to parse JSON from request body',
                    user: cookies.get('remember-token')
                }
            )
        )
        return new Response('Invalid body', { status: 400 })
    }

    if (!body || !body.pokemonId || body.pokemonId.length === 0){
        return new Response('Empty body', { status: 400 });
    }

    try {
        const existing = await authedPb.collection('teams').getOne(params.id) as IRecordTeam;
        await authedPb.collection('teams').update(params.id, {
            bench: existing.bench.filter((a) => a !== body.pokemonId),
            party: existing.party.filter((a) => a !== body.pokemonId)
        })

        await authedPb.collection('team_pokemon').delete(body.pokemonId);
    } catch(err){
        platform?.context.waitUntil(
            Logger.error(
                Logger.ErrorClasses.TeamOperation,
                Logger.buildError(err),
                {
                    context: 'Deleting a Team Pokémon',
                    errorMessage: 'Failed to delete Pokemon from DB entries',
                    user: cookies.get('remember-token'),
                    team: params.id
                }
            )
        )

        return new Response('Internal Error', { status: 500})
    }

    return new Response('Ok', { status: 200})
}