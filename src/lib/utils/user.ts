import { PUBLIC_HOST_URL } from '$env/static/public';

export const isValidUsername = async (
	username: string
): Promise<{ valid: boolean; message: string }> => {
	if (username.length <= 4) {
		return {
			valid: false,
			message: 'Username too short'
		};
	}

	const normalisedUsername = username
		.toLowerCase()
		.replaceAll(' ', '')
		.replaceAll('0', 'o')
		.replaceAll('1', 'i')
		.replaceAll('3', 'e')
		.replaceAll('4', 'a')
		.replaceAll('5', 's')
		.replaceAll('7', 'l');

	const toxicResponse = await fetch(`${PUBLIC_HOST_URL}/api/toxic?term=${normalisedUsername}`);
	const toxicBody = await toxicResponse.json();

	if (toxicBody.score >= 0.4) {
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
