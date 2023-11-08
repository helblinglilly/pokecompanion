import isStringToxic from './toxic';

export const isUsernameValid = async (
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

const passwordPattern = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/;
const passwordRequirements =
	'Must contain: 1 uppercase, 1 lowercase, 1 number, 1 special char and be 8+ characters long';
export const isPasswordValid = (password: string) => {
	if (!passwordPattern.test(password)) {
		return {
			valid: false,
			feedback: passwordRequirements
		};
	}
	return {
		valid: true,
		feedback: ''
	};
};
