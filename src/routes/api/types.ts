export interface Platform {
	context: {
		waitUntil(promise: Promise<unknown>): void;
	}
	caches: CacheStorage & { default: Cache }
}