import { defineEnvVars } from '@sveltejs/kit/env';

export const variables = defineEnvVars({
	PUBLIC_API_HOST: { public: true },
	DISCORD_WEBHOOK_URL: { static: true },
	PUBLIC_ENVIRONMENT: { public: true },
	PUBLIC_POSTHOG_KEY: { public: true }
});
