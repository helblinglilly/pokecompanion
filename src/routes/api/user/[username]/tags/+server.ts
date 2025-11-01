import { getTagsByUsername } from '$/lib/stores/tags';

export async function GET({ params }) {
	const tags = await getTagsByUsername(params.username);

	return new Response(JSON.stringify(tags), { status: tags.length > 0 ? 200 : 202 });
}
