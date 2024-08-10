import { Logger } from "$/lib/log";
import { validateAuth } from "$/routes/api/helpers";
import type { IRecordTeam } from "$/lib/types/ITeams.js";
import type { RecordModel } from "pocketbase";

export async function PATCH({ request, cookies, platform, params }) {
    const authedPb = await validateAuth(request, cookies);

    if (!authedPb){
        return new Response('Not authorised', { status: 401 });
    }

    let body: { party: {id: string, position: number }[]};
    try {
        body = await request.json();
    } catch(err){
        platform?.context.waitUntil(
            Logger.error(
                Logger.ErrorClasses.TeamOperation,
                Logger.buildError(err),
                {
                    context: 'Patching a team party',
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
        return new Response('Emtpy body', { status: 400 });
    }   

    
    const requestParty = body.party.filter((a) => !!a.id);

    const existingEntries = await authedPb.collection('teams').getOne(params.id) as IRecordTeam & RecordModel;

    const addToParty = requestParty.filter((bodyMon) => !existingEntries.party.includes(bodyMon.id)).map((a) => a.id);
    const removeFromParty = existingEntries.party.filter((partyMon) => !requestParty.some((reqMon) => reqMon.id === partyMon));

    const addToBench = [...removeFromParty];
    const removeFromBench = [...addToParty];
    const newBench = addToBench.concat(existingEntries.bench).filter((a) => !removeFromBench.includes(a));

    try {
        await authedPb.collection('teams').update(params.id, {
            party: requestParty.map((a) => a.id),
            bench: newBench
        })

        for(let i = 0; i < requestParty.length; i++){
            await authedPb.collection('team_pokemon').update(requestParty[i].id, {
                position: i
            })
        }
    } catch (err){
        return new Response('Internal error', { status: 500 });
    }

    return new Response('WIP', { status: 200 });
}