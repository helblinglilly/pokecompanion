import { pb } from '$lib/pocketbase';
import { PUBLIC_POCKETBASE_URL } from '$env/static/public';

interface IPublicUserResponse {
	avatar_url: string;
	id: string;
	username: string;
}

export interface IPublicUser {
	username: string;
	avatar: string;
}

export const getUserById = async (id: string): Promise<IPublicUser | undefined> => {
	if (!id) {
		return;
	}
	try {
		const user = (await pb.collection('public_users').getOne(id)) as IPublicUserResponse;
		return {
			username: user.username,
			avatar: `${PUBLIC_POCKETBASE_URL}/${user.avatar_url}`
		};
	} catch (err) {
		return;
	}
};

export const getUserByUsername = async (username: string): Promise<IPublicUser | undefined> => {
	if (!username) {
		return;
	}
	try {
		const user = (await pb
			.collection('public_users')
			.getFirstListItem(`username="${username}"`)) as IPublicUserResponse;
		return {
			username: user.username,
			avatar: user.avatar_url
		};
	} catch (err) {
		return;
	}
};

export const getIdByUsername = async (username: string): Promise<string | undefined> => {
	if (!username) {
		return;
	}

	try {
		const user = (await pb
			.collection('public_users')
			.getFirstListItem(`username="${username}"`)) as IPublicUserResponse;
		return user.id;
	} catch (err) {
		return;
	}
};
