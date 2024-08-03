import { Logger } from "$/lib/log";
import type { ITeam } from "$/lib/types/ITeams";
import { validateAuth } from "../../helpers";

export async function PATCH({ request, cookies, platform, params}) {
    const authedPb = await validateAuth(request, cookies);

    if (!authedPb){
        return new Response('Not authorised', { status: 401 });
    }

    let body: { isPrivate?: boolean, description?: string };

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
    await authedPb.collection('teams').update(params.id, newEntries)
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
        await authedPb.collection('teams').delete(params.id);
    } catch(err){
        return new Response('Internal Error', {
            status: 500
        })
    }

    return new Response('Ok', {
        status: 200
    })
}