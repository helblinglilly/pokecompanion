import pako from 'pako';
import { NEW_RELIC_ACCOUNT_ID, NEW_RELIC_LICENSE_KEY } from '$env/static/private';
import { PUBLIC_LOGGING_API_KEY } from '$env/static/public';

export interface IRequestBody {
	eventType: string;
	[key: string]: unknown;
}

export const POST = async ({ request }) => {
	const auth = request.headers.get('Authentication');
	if (auth !== PUBLIC_LOGGING_API_KEY){
		return new Response('Unauthorised', {
			status: 401
		})
	}

	let body: IRequestBody | undefined;

	try {
		body = await request.json();
		if (!body){
			throw new Error('Empty body');
		}
	} catch(err){
		return new Response('Invalid body', {
			status: 400
		})
	}

	try {
		const res = await serverSideNRLog(body);
		if (!res){
			throw new Error('No "eventType" has been provided in the body');
		}
		return new Response(res?.statusText, {
			status: res.status
		})
	} catch(err){
		console.log(err);
		return new Response('Failure', {
			status: 500
		})
	}
}

const serverSideNRLog = async (body: IRequestBody) => {
	if (!body.eventType){
		console.log('ServerSideNRLog: Did not send log because body did not contain "eventType"')
		return;
	}

	const compressedPayload = pako.gzip(JSON.stringify(body))
	return await fetch(`https://insights-collector.eu01.nr-data.net/v1/accounts/${NEW_RELIC_ACCOUNT_ID}/events`, {
		method: 'POST',
		body: compressedPayload,
		headers: {
			'Api-Key': NEW_RELIC_LICENSE_KEY,
			'content-type': 'application/json',
			'content-encoding': 'gzip'
		}
	});
}