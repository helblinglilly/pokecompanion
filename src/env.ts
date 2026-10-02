import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	PUBLIC_API_HOST: { public: true, static: true },
	DISCORD_WEBHOOK_URL: {},
	PUBLIC_ENVIRONMENT: { public: true, static: true },
	PUBLIC_POSTHOG_KEY: { public: true, static: true }
});
