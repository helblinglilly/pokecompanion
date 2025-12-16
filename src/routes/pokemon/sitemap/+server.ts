import type { paths } from '$/@types/api';
import { PUBLIC_API_HOST } from '$env/static/public';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ fetch }) => {
	const validPokemon = [];

	const metaRes = await fetch(`${PUBLIC_API_HOST}/meta`, {
		credentials: 'include'
	});

	const meta =
		(await metaRes.json()) as paths['/meta']['get']['responses']['200']['content']['application/json'];

	for (let i = 1; i < meta.lastPokedexEntry; i++) {
		validPokemon.push(i);
	}

	const sitemap = `
        <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
            ${validPokemon
							.map(
								(id) => `
                <url>
                    <loc>https://pokecompanion.com/pokemon/${id}</loc>
                    <changefreq>monthly</changefreq>
                    <priority>0.3</priority>
                </url>
            `
							)
							.join('')}
        </urlset>
    `;

	return new Response(sitemap, {
		headers: {
			'Content-Type': 'application/xml'
		}
	});
};
