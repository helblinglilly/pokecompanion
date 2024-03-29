import { PUBLIC_POCKETBASE_URL } from '$env/static/public';
import { Logger } from '$lib/log';
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
		await Logger.error(
			Logger.ErrorClasses.UserOperation,
			Logger.buildError(err),
			{
				context: 'Failed to public user by ID',
				user: id
			}
		)
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
		await Logger.error(
			Logger.ErrorClasses.UserOperation,
			Logger.buildError(err),
			{
				context: 'Failed to get user by username',
				username,
			}
		)
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
		await Logger.error(
			Logger.ErrorClasses.UserOperation,
			Logger.buildError(err),
			{
				context: 'Failed to get user id by username',
				username: username
			}
		)
		return;
	}
};
