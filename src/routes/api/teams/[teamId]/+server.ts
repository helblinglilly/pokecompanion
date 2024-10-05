import { Logger } from "$/lib/log";
import type { IRecordPokemon } from "$/lib/types/IPokemon";
import type { IRecordTeam, ITeam, ITeamPokemon } from "$/lib/types/ITeams";
import type { RecordModel } from "pocketbase";
import { validateAuth } from "../../helpers";

export async function PATCH({ request, cookies, platform, params}) {
    const authedPb = await validateAuth(request, cookies);

    if (!authedPb){
        return new Response('Not authorised', { status: 401 });
    }

    let body: { isPrivate?: boolean, description?: string, party: ITeamPokemon[] };

    try {
        body = await request.json();
    } catch(err){
        platform?.context.waitUntil(
            Logger.error(
                Logger.ErrorClasses.TeamOperation,
                Logger.buildError(err),
                {
                    context: 'Patching a team',
                    errorMessage: 'Failed to parse JSON from request body',
                    user: cookies.get('remember-token')
                }
            )
        )
        return new Response('Invalid body', {
            status: 400
        })
    }

    if (!body){
        return new Response('Empty body', {
            status: 400
        });
    }


    const newEntries: Partial<ITeam> = {};

    if (body.isPrivate !== undefined){
        newEntries.isPrivate = body.isPrivate
    }
    if (body.description !== undefined){
        newEntries.description = body.description
    }

   try {
    await authedPb.collection('teams').update(params.teamId, newEntries)
   } catch(err){
    return new Response('Something went wrong activating an existing entry', {
        status: 500
    })
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

    try {
        // Get existing team entries
        const existing = await authedPb.collection('teams').getOne(params.teamId) as IRecordTeam & RecordModel

        // Clear out relations from teams
        await authedPb.collection('teams').update(params.teamId, {
            party: [],
            bench: []
        })

        // Delete from team_pokemon
        for(let i = 0; i < existing.party.length; i++){
            await authedPb.collection('team_pokemon').delete(existing.party[i]);
        }
        for(let i = 0; i < existing.bench.length; i++){
            await authedPb.collection('team_pokemon').delete(existing.bench[i]);
        }

        // Delete the now emtpy team
        await authedPb.collection('teams').delete(params.teamId);
    }
        catch(err){
        Logger.error(
            Logger.ErrorClasses.TeamOperation,
            Logger.buildError(err),
            {
                context: `Team ${params.teamId}`
            }
        )
        return new Response('Internal Error', {
            status: 500
        })
    }

    return new Response('Ok', {
        status: 200
    })
}