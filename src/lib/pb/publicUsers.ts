import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import { logError } from '$lib/log';
import Pocketbase from 'pocketbase';

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
	const pb = new Pocketbase(PUBLIC_POCKETBASE_URL);
	try {
		const user = (await pb.collection('public_users').getOne(id)) as IPublicUserResponse;
		return {
			username: user.username,
			avatar: `${PUBLIC_POCKETBASE_URL}/${user.avatar_url}`
		};
	} catch (err) {
		logError(`Failed to get public user by ID ${id}`, `Failed to fetch user`, err);
		return;
	}
};

export const getUserByUsername = async (username: string): Promise<IPublicUser | undefined> => {
	if (!username) {
		return;
	}
	const pb = new Pocketbase(PUBLIC_POCKETBASE_URL);
	try {
		const user = (await pb
			.collection('public_users')
			.getFirstListItem(`username="${username}"`)) as IPublicUserResponse;
		return {
			username: user.username,
			avatar: user.avatar_url
		};
	} catch (err) {
		logError(`Failed to get user by username ${username}`, 'Failed to fetch user', err);
		return;
	}
};

export const getIdByUsername = async (username: string): Promise<string | undefined> => {
	if (!username) {
		return;
	}
	const pb = new Pocketbase(PUBLIC_POCKETBASE_URL);
	try {
		const user = (await pb
			.collection('public_users')
			.getFirstListItem(`username="${username}"`)) as IPublicUserResponse;
		return user.id;
	} catch (err) {
		logError(`Failed to get user id by username ${username}`, `Failed to fetch user`, err);
		return;
	}
};
