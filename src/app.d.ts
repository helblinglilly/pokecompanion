// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		interface Locals {
			pb: import('pocketbase').default;
			user: import('pocketbase').default['authStore']['model'];
		}
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		export interface Platform {
			context: {
				waitUntil(promise: Promise<unknown>): void;
			}
			caches: CacheStorage & { default: Cache }
		}
	}

	interface Window {
		newrelic?: {
			addPageAction: (name: string, attributes?: object) => void;
			noticeError: (error: Error, attributes?: object) => void;
			setCustomAttribute: (name: string, value: unknown) => void;
			setUserId: (value: string | null) => void;
		};
	  }
}

export {};