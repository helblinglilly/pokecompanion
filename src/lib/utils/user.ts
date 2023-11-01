import isStringToxic from './toxic';

export const isValidUsername = async (
	username: string
): Promise<{ valid: boolean; message: string }> => {
	if (username.length <= 4) {
		return {
			valid: false,
			message: 'Username too short'
		};
	}

	const isToxic = await isStringToxic(username);

	if (isToxic) {
		return {
			valid: false,
			message: 'Toxic username'
		};
	}

	return {
		valid: true,
		message: ''
	};
};
