import type { PokeapiVersionNames } from '$/lib/data/games.js';
import { Logger } from '$/lib/log.js';
import isStringToxic from '$/lib/server/toxic.js';
import { validateAuth } from '../helpers.js';

export async function POST({ request, cookies, platform }) {
    
    const authedPb = await validateAuth(request, cookies);
    if (!authedPb){
        return new Response('Not authorised', { status: 401 });
    }

    let body: { name: string; description: string; game: PokeapiVersionNames, isPrivate: boolean } | undefined;

    try{ 
        body = await request.json();
    } catch(err){
        platform?.context.waitUntil(
            Logger.error(
                Logger.ErrorClasses.TeamOperation,
                Logger.buildError(err),
                {
                    context: 'Creating a new team',
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
        })
    }

    if (!body.name || !body.game){
        return new Response('Invalid body', { status: 400})
    }

    const [isNameToxic, isDescriptionToxic] = await Promise.all([
        isStringToxic(body.name),
        isStringToxic(body.description ?? '')
    ]);

    if (isNameToxic || isDescriptionToxic){
        Logger.info('Caught Toxic team', {
            context: 'Creating a new team',
            name: body.name,
            description: body.description
        })
        return new Response('Failed to create new team', {
            status: 500
        })
    }

    let isActiveForGame = false;

    try {
        const existingForGame = await authedPb.collection('teams').getFirstListItem(
            `owner.id="${authedPb.authStore.model?.id}" && game="${body.game}" && isActiveForGame=true`
        )

        if (!existingForGame){
            isActiveForGame = true;
        }
    } catch(err){
        // eslint-disable-next-line @typescript-eslint/ban-ts-comment
        // @ts-ignore Pocketbase error returned here
        if (err?.status === 404){
            isActiveForGame = true;
        }

        platform?.context.waitUntil(
            Logger.error(
                Logger.ErrorClasses.TeamOperation,
                Logger.buildError(err),
                {
                    context: 'Creating a new team',
                    errorMessage: 'Failed to get existing teams for this game',
                    user: cookies.get('remember-token'),
                    name: body.name
                }
            )
        )
    }

    console.log('Will set as active', isActiveForGame);
    try {
        await authedPb.collection('teams').create({
            owner: authedPb.authStore.model?.id,
            name: body.name,
            description: body.description,
            game: body.game,
            isPrivate: body.isPrivate,
            isActiveForGame
        })
    } catch(err){
        platform?.context.waitUntil(
            Logger.error(
                Logger.ErrorClasses.TeamOperation,
                Logger.buildError(err),
                {
                    context: 'Creating a new team',
                    errorMessage: 'Failed to insert a new team into the DB',
                    user: cookies.get('remember-token'),
                    name: body.name
                }
            )
        )

        return new Response('Failed to create new team', {
            status: 500
        })
    }

    return new Response('created');
}

