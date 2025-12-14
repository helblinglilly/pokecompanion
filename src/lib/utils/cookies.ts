/*
	Below functions are taken from
	https://javascript.info/cookie
*/
const getCookie = (name: string) => {
	const matches = document.cookie.match(
		// eslint-disable-next-line no-useless-escape
		new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)')
	);
	return matches ? decodeURIComponent(matches[1] ?? '') : undefined;
};

const getRawCookie = (cookieString: string | null, name: string) => {
	if (!cookieString) {
		return '';
	}
	const matches = cookieString.match(
		// eslint-disable-next-line no-useless-escape
		new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)')
	);
	return matches ? matches[0].replace('; ', '') : '';
};

const setCookie = (
	name: string,
	value: string,
	overrideOptions?: { expires?: Date; path?: string; SameSite?: 'Lax'; 'max-age'?: number }
) => {
	let expires = new Date();
	expires.setDate(expires.getDate() + 90);

	if (overrideOptions?.expires) {
		expires = overrideOptions.expires;
	}

	const options = {
		path: '/',
		expires: overrideOptions?.expires ?? expires,
		SameSite: 'Lax',
		Domain: `.${window.location.hostname}`,
		...overrideOptions
	};

	let updatedCookie = encodeURIComponent(name) + '=' + encodeURIComponent(value);

	for (const [key, value] of Object.entries(options)) {
		updatedCookie += '; ' + `${key}=${value}`;
	}
	document.cookie = updatedCookie;
};

const deleteCookie = (name: string) => {
	setCookie(name, '', {
		'max-age': -1
	});
};

export { getCookie, setCookie, deleteCookie, getRawCookie };
