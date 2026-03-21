import { redirect } from '@sveltejs/kit';

export function load() {
	redirect(302, `/privacy/policy/versions/2026-03-21`);
}
