import type { AuthRecord } from 'pocketbase';

export interface PocketbaseError {
	url: string;
	code: number;
	message: string;
	response: {
		data: Record<
			string,
			{
				code: string;
				message: string;
			}
		>;
	};
}

export interface PBOAuthResponseGoogle {
	id: string;
	name: string;
	/**
		@ignore
		Will be empty for OAuth users
		 */
	username: string;
	avatarUrl: string;
	accessToken: string;
	refreshToken: string;
	/**
    @type Date ISO 8601
    */
	expiry: string;
	isNew: boolean;
}

export interface PBAuthResponse {
	meta?: PBOAuthResponseGoogle;
	record: {
		avatar: string;
		collectionId: string;
		collectionName: string;
		created: string;
		email: string;
		emailVisibility: boolean;
		id: string;
		username: string;
		updated: string;
		verified: boolean;
	};
	token: string;
}

export type PBAuthRecord = {
	avatar: string | undefined;
	created: string;
	email: string;
	emailVisibility: boolean;
	updated: string;
	username: string;
	verified: boolean;
} & AuthRecord;
