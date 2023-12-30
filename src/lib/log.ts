import * as Sentry from '@sentry/browser';
/* https://github.com/getsentry/sentry-javascript/issues/8291 */
import { PUBLIC_AXIOM_TOKEN, PUBLIC_AXIOM_DATASET } from '$env/static/public';
import { page } from '$app/stores';
import { get } from 'svelte/store';
import { removeLastCharIfExists } from './utils/string';
import { rememberToken } from './stores/domain';
import type { Cookies } from '@sveltejs/kit';

const apiUrl = `https://api.axiom.co/v1/datasets/${PUBLIC_AXIOM_DATASET}/ingest`;

const logToAxiom = (other: object, serverRequest?: Request, serverCookies?: Cookies) => {
	try {
		// Try to log on client
		// Subscribing to store will fail on server side
		const ps = get(page);
		const rememberStore = get(rememberToken);

		fetch(apiUrl, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${PUBLIC_AXIOM_TOKEN}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify([
				{
					_time: new Date().toISOString(),
					data: {
						application: 'pokecompanion',
						status: ps.status,
						error: ps.error,
						url: {
							host: ps.url.host,
							hostname: ps.url.hostname,
							href: ps.url.href,
							pathname:
								ps.url.pathname !== '/'
									? removeLastCharIfExists(ps.url.pathname, '/')
									: ps.url.pathname,
							search: ps.url.search,
							hash: ps.url.hash
						},
						user: {
							signedIn: ps.data.user?.id,
							isSignedIn: ps.data.user?.id ? true : false,
							rememberToken: rememberStore
						},
						...other
					}
				}
			])
		}).catch((error) => console.error('Error:', error));
	} catch {
		if (!serverRequest) {
			console.error('Trying to log on the server side, but no request has been provided');

			fetch(apiUrl, {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${PUBLIC_AXIOM_TOKEN}`,
					'Content-Type': 'application/json'
				},
				body: JSON.stringify([
					{
						_time: new Date().toISOString(),
						data: {
							application: 'pokecompanion',
							status: 500,
							error: 'FAILED_TO_LOG',
							...other
						}
					}
				])
			}).catch((error) => console.error('Error:', error));
			return;
		}

		const urlParts = serverRequest.url.split('/');
		const host = urlParts[2];
		const hostname = urlParts[2].split(':')[0];

		const route = '/' + urlParts.splice(3).join('/');
		const pathname = removeLastCharIfExists(route, '/');

		// Make default > 16 chars as that will show as not signed in
		const rememberToken =
			serverCookies?.get('rememberToken') ?? 'no remembertoken present on server request';

		fetch(apiUrl, {
			method: 'POST',
			headers: {
				Authorization: `Bearer ${PUBLIC_AXIOM_TOKEN}`,
				'Content-Type': 'application/json'
			},
			body: JSON.stringify([
				{
					_time: new Date().toISOString(),
					data: {
						application: 'pokecompanion',
						url: {
							host,
							hostname,
							href: serverRequest.url,
							pathname,
							search: serverRequest.url.split('?')[1],
							hash: serverRequest.url.split('#')[1]
						},
						user: {
							// signedIn based on length of rememberToken
							signedIn: rememberToken,
							isSignedIn: rememberToken.length <= 16,
							rememberToken: rememberToken
						},
						...other
					}
				}
			])
		}).catch((error) => console.error('Error:', error));
	}
};

const error = (message: string, errorId: string, details?: unknown) => {
	const timestamp = new Date().toISOString();
	const level = 'ERROR';

	
	Sentry.captureMessage(message, {
		level: 'error',
		extra: {
			errorId,
			details
		}
	});

	if (!details) details = '';

	console.error(timestamp, level, errorId, `'${message}'`, details);
	logToAxiom({ action: 'log', level: 'error', message: message, details: details });
};

const info = (message: string) => {
	const timestamp = new Date().toISOString();
	const level = 'INFO';

	console.info(timestamp, level, message);
	logToAxiom({ action: 'log', level: 'info', message: message });
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const warn = (message: string, extra: any) => {
	const timestamp = new Date().toISOString();
	const level = 'WARN';

	Sentry.captureMessage(message, {
		level: 'warning',
		extra
	});
	console.warn(timestamp, level, message);
	logToAxiom({ action: 'log', level: 'warning', message: message, extra: { ...extra } });
};

export { error, info, warn, logToAxiom };
