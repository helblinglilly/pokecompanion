/*
	Below functions are taken from
	https://javascript.info/cookie
*/
const getCookie = (name: string) => {
	const matches = document.cookie.match(
		// eslint-disable-next-line no-useless-escape
		new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)')
	);
	return matches ? decodeURIComponent(matches[1]) : undefined;
};

const getRawCookie = (cookieString: string | null, name: string) => {
	if (!cookieString) {
		return '';
	}
	const matches = cookieString.match(
		// eslint-disable-next-line no-useless-escape
		new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)')
	);
	return matches ? matches[0] : '';
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

type BaseCookieAttributes = {
	Path: string;
	SameSite: 'none' | 'lax' | 'strict' | undefined;
	httpOnly: boolean | undefined;
	Secure: boolean | undefined;
	Expires: Date;
};

type CookieValues = { [key: string]: string };

const parseCookieString = (cookieString: string): BaseCookieAttributes & CookieValues => {
	const baseCookieAttributes: BaseCookieAttributes = {
		Path: '/',
		SameSite: 'none',
		httpOnly: undefined,
		Expires: new Date(),
		Secure: undefined
	};

	const cookieValues: CookieValues = {};

	const cookiePairs = cookieString.split(';');
	for (const pair of cookiePairs) {
		const [key, value] = pair.trim().split('=');
		if (key in baseCookieAttributes) {
			// eslint-disable-next-line @typescript-eslint/ban-ts-comment
			// @ts-ignore
			baseCookieAttributes[key as keyof BaseCookieAttributes] = value;
		} else {
			cookieValues[key] = decodeURIComponent(value);
		}
	}

	const parsedCookie: BaseCookieAttributes & CookieValues = {
		...baseCookieAttributes,
		...cookieValues
	} as BaseCookieAttributes & CookieValues;

	return parsedCookie;
};

export { getCookie, setCookie, deleteCookie, getRawCookie, parseCookieString };
