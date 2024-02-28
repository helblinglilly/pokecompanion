import * as Sentry from '@sentry/browser';
/* https://github.com/getsentry/sentry-javascript/issues/8291 */
import { PUBLIC_AXIOM_TOKEN, PUBLIC_AXIOM_DATASET } from '$env/static/public';
import { page } from '$app/stores';
import { get } from 'svelte/store';
import { removeLastCharIfExists } from './utils/string';
import { rememberToken } from './stores/domain';
import type { Cookies } from '@sveltejs/kit';

const apiUrl = `https://api.axiom.co/v1/datasets/${PUBLIC_AXIOM_DATASET}/ingest`;

const logToAxiom = async (
	other: object,
	serverRequest?: Request | undefined,
	serverCookies?: Cookies | undefined
) => {
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
			console.warn(
				'Trying to log on the server side, but no request has been provided',
				new Error().stack
			);

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
							logIssue: 'Could not log client side but not request/cookies have been provided',
							...other
						}
					}
				])
			}).catch((error) => console.error('Failed to log on the server side:', error));

			return;
		}

		const urlParts = serverRequest.url.split('/');
		const host = urlParts[2];
		const hostname = urlParts[2].split(':')[0];

		const route = '/' + urlParts.splice(3).join('/');
		const pathname = removeLastCharIfExists(route, '/');

		// Make default > 16 chars as that will show as not signed in
		const rememberToken =
			serverCookies?.get('remember-token') ?? 'no remember token present on server request';

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
							isSignedIn: rememberToken.length <= 16,
							rememberToken: rememberToken
						},
						...other
					}
				}
			])
		}).catch((error) => console.error('Failed to log on the server side:', error));
	}
};

const logError = async (
	message: string,
	errorId: string,
	details?: {
		request?: Request;
		cookies?: Cookies;
	} & Record<string, unknown>
) => {
	const timestamp = new Date().toISOString();
	const level = 'ERROR';

	const smallDetails = {
		...details
	};
	delete smallDetails.cookies;
	delete smallDetails.request;

	Sentry.captureMessage(message, {
		level: 'error',
		extra: {
			errorId,
			details: smallDetails
		}
	});

	console.error(timestamp, level, errorId, message, smallDetails);
	await logToAxiom(
		{
			action: 'log',
			level: 'error',
			message: message,
			errorId,
			details: { ...smallDetails }
		},
		details?.request,
		details?.cookies
	);
};

const info = async (
	message: string,
	details?: {
		request?: Request;
		cookies?: Cookies;
	} & Record<string, unknown>
) => {
	const timestamp = new Date().toISOString();
	const level = 'INFO';

	const smallDetails = {
		...details
	};
	delete smallDetails.cookies;
	delete smallDetails.request;

	console.info(timestamp, level, message);
	Sentry.captureMessage(message, {
		level: 'info',
		extra: {
			details: smallDetails
		}
	});

	await logToAxiom(
		{
			action: 'log',
			level: 'info',
			message: message,
			details: { ...smallDetails }
		},
		details?.request,
		details?.cookies
	);
};

const warn = async (
	message: string,
	errorId: string,
	details?: {
		request?: Request;
		cookies?: Cookies;
	} & Record<string, unknown>
) => {
	const timestamp = new Date().toISOString();
	const level = 'WARNING';

	const smallDetails = {
		...details
	};
	delete smallDetails.cookies;
	delete smallDetails.request;

	Sentry.captureMessage(message, {
		level: 'warning',
		extra: {
			errorId,
			details: smallDetails
		}
	});

	console.warn(timestamp, level, errorId, message, smallDetails);
	await logToAxiom(
		{
			action: 'log',
			level: 'warn',
			message: message,
			errorId,
			details: { ...smallDetails }
		},
		details?.request,
		details?.cookies
	);
};

export { logError, info, warn, logToAxiom };
