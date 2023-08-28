export interface UserInfo {
	user: {
		id: string;
	};
}

export function load(): UserInfo {
	return {
		user: {
			id: 'USER1234'
		}
	};
}
