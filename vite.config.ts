// import { sentrySvelteKit } from '@sentry/sveltekit';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

const API_HOST = process.env.PUBLIC_API_HOST ?? 'https://api.pokecompanion.com';
const IS_DEV = process.env.NODE_ENV === 'development';
const PROXY_PREFIX = '/proxy';

const rewriteProxyLocation = (location: string | undefined, host: string | undefined) => {
	if (!location || !host || !location.startsWith(API_HOST)) {
		return location;
	}

	return `http://${host}${PROXY_PREFIX}${location.slice(API_HOST.length)}`;
};

export default defineConfig({
	plugins: [
		sveltekit()
	],
	server: {
		proxy: IS_DEV ? {
			'/proxy': {
				target: API_HOST,
				changeOrigin: true,
				cookieDomainRewrite: {
					'*': ''
				},
				rewrite: (path) => path.replace(/^\/proxy/, ''),
				configure: (proxy) => {
					proxy.on('proxyRes', (proxyRes, req) => {
						const location = proxyRes.headers.location;
						if (typeof location === 'string') {
							proxyRes.headers.location = rewriteProxyLocation(location, req.headers.host);
						}
					});
				}
			}
		} : {}
	},
	test: {
		include: ['src/**/*.{test,spec}.{js,ts}'],
	},
	define: {
		'process.browser': true
	},
	resolve: {
		conditions: [
		  ...process.env.VITEST ? ['browser'] : []
		]
	  },
});
