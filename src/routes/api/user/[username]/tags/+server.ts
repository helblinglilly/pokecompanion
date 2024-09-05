import { validateAuth } from "$/routes/api/helpers";
import { PUBLIC_POCKETBASE_URL } from "$env/static/public";
import Pocketbase from 'pocketbase';
import { getTagsByUsername } from "./helper.js";

export async function GET ({ request, cookies, params}) {
    let pb = new Pocketbase(PUBLIC_POCKETBASE_URL);

	const authedPb = await validateAuth(request, cookies);
	if (authedPb) {
		pb = authedPb;
	}

    const tags = await getTagsByUsername(pb, params.username);

    return new Response(JSON.stringify(tags), { status: tags.length > 0 ? 200 : 202 });
}
