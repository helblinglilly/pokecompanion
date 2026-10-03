import { redirect } from '@sveltejs/kit';

export async function load({ params }) {
	redirect(307, `https://legacy.pokecompanion.com/ability/${params.abilityId}`, { external: true });
}
