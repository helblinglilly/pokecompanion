// import { sentrySvelteKit } from '@sentry/sveltekit';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

const API_HOST = process.env.PUBLIC_API_HOST ?? 'https://api.pokecompanion.com';
const IS_DEV = process.env.NODE_ENV === 'development';

export default defineConfig({
	plugins: [
		sveltekit()
	],
	server: {
		proxy: IS_DEV ? {
			'/proxy': {
				target: 'https://api.pokecompanion.com',
				changeOrigin: true,
				rewrite: (path) => path.replace(/^\/proxy/, '')
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
