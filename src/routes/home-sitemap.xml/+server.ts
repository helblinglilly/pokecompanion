import type { RequestHandler } from "@sveltejs/kit";

export const GET: RequestHandler = async () => {	
 

    const sitemap = `<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
<url>
    <loc>https://pokecompanion.com</loc>
    <lastmod>2024-04-20T18:41:35+00:00</lastmod>
    <priority>1.0</priority>
</url>
<url>
    <loc>https://pokecompanion.com/about</loc>
    <lastmod>2024-04-20T18:41:35+00:00</lastmod>
    <priority>0.8</priority>
</url>
<url>
    <loc>https://pokecompanion.com/pokemon</loc>
    <lastmod>2024-04-20T18:41:35+00:00</lastmod>
    <priority>0.8</priority>
</url>
<url>
    <loc>https://pokecompanion.com/settings</loc>
    <lastmod>2024-04-20T18:41:35+00:00</lastmod>
    <priority>0.3</priority>
</url>
</urlset>`;

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
        },
    });
};