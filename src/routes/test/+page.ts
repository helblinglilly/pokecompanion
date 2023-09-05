import type { UserInfo } from './+page.server';

export async function load({ data }: { data: UserInfo }) {
	let body;
	try {
		console.log('starting network response');
		const response = await fetch('https://pokeapi.co/api/v2/pokemon/ditto');
		body = await response.json();
		console.log('network request was successful');
	} catch (err) {
		console.log('error in network request', err);
	}
	return {
		post: {
			title: 'hello',
			content: 'world',
			pokeData: body
		},
		...data
	};
}
