import { createInstance } from '$lib/pocketbase';

export const getSearchParam = (url: string, name: string) => {
	const searchParts = url.split('?')[1];
	if (!searchParts) {
		return;
	}
	const result = searchParts.split('&').find((keypair) => {
		const [key] = keypair.split('=');
		return key === name;
	});

	if (!result) {
		return;
	}

	return result.split('=')[1];
};

export const getCookies = (request: Request) => {
	let result = '';
	request.headers.forEach((val, key) => {
		if (key === 'cookie') {
			result = val;
		}
	});
	return result;
};

export const getCookieValue = (request: Request, name: string) => {
	const cookieValues = getCookies(request);
	if (!cookieValues) {
		return '';
	}

	const values = cookieValues.split('; ');
	let result = '';
	values.find((value) => {
		const [key, val] = value.split('=');
		if (key === name) {
			result = val;
		}
	});
	return result;
};

export const validateAuth = async (request: Request) => {
	const cookies = request.headers.get('cookie');
	if (!cookies) {
		return false;
	}

	const pb = createInstance();
	pb.authStore.loadFromCookie(cookies);

	try {
		if (!pb.authStore.isValid) {
			return false;
		}
		pb.authStore.isValid && (await pb.collection('users').authRefresh());
	} catch {
		pb.authStore.clear();
		return false;
	}
	return pb;
};
