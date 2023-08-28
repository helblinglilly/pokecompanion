import type { UserInfo } from './+page.server';

export function load({ data }: { data: UserInfo }) {
	return {
		post: {
			title: 'hello',
			content: 'world'
		},
		...data
	};
}
