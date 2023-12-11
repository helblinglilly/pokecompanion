import { toSvg } from 'jdenticon';
import { getSearchParam } from '../helpers';

export async function GET({ request }) {
	const key = getSearchParam(request.url, 'key');

	const image = toSvg(key, 128);

	return new Response(image, {
		headers: {
			'Content-Type': 'image/svg+xml'
		}
	});
}
