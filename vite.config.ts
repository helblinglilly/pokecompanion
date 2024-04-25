// import { sentrySvelteKit } from '@sentry/sveltekit';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vitest/config';

export default defineConfig({
	plugins: [
		// sentrySvelteKit({
		// 	sourceMapsUploadOptions: {
		// 		org: process.env.SENTRY_ORG,
		// 		project: process.env.SENTRY_PROJECT,
		// 		authToken: process.env.SENTRY_AUTH,
		// 		telemetry: process.env.VITE_VERCEL_ENV ? true : false
		// 	}
		// }),
		sveltekit()
	],
	ssr: {
		noExternal: ['@jill64/sentry-sveltekit-cloudflare']
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
	  }
});
