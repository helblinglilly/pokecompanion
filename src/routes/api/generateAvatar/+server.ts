import { toSvg } from 'jdenticon';

const getSearchParam = (url: string, name: string) => {
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

export async function GET({ request }) {
	const key = getSearchParam(request.url, 'id');

	const image = toSvg(key, 128);

	return new Response(image, {
		headers: {
			'Content-Type': 'image/svg+xml'
		}
	});
}
