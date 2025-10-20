import { lastPokedexEntry } from '$lib/stores/domain';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async () => {
	const validPokemon = [];

	for (let i = 1; i < lastPokedexEntry; i++) {
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
