import { Logger } from "$/lib/log";
import type { Platform } from "$/routes/api/types";

export const fetchCacheFirst = async(url: string | URL, platform: Readonly<Platform> | undefined): Promise<Response> => {
	const parsedUrl = new URL(url);
	const req = new Request(parsedUrl);

	if (platform?.caches?.default){
		try {
			const cacheResponse = await platform.caches.default.match(url);
			if (cacheResponse){
				return cacheResponse;
			}
		} catch(err){
			platform.context.waitUntil(
				Logger.warn(
					'Tried to read request from cache, but threw an error',
					{
						request: url,
						error: Logger.buildError(err).message
					}
				)
			)
		}
	}

	const res = await fetch(req);
	if (res.ok && platform?.caches?.default){
		try {
			const responseToCache = res.clone();
            platform.context.waitUntil(
                platform.caches.default.put(url, responseToCache)
            );
		} catch(err){
			platform.context.waitUntil(
				Logger.warn(
					'Failed to place successful request in cache',
					{
						request: url,
						error: Logger.buildError(err).message
					}
				)
			)
		}
	}
	return res;
}
