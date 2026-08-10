import type { AuthRecord } from '$lib/stores/user';

type EventProperties = Record<string, unknown>;

const posthog = () => (typeof window === 'undefined' ? undefined : window.posthog);

export const tracker = {
	captureEvent(eventName: string, properties?: EventProperties) {
		posthog()?.capture(eventName, properties);
	},
	identifyUser(user: AuthRecord) {
		posthog()?.identify(user.id, { username: user.username });
	},
	setPersonProperties(properties: EventProperties) {
		posthog()?.setPersonProperties(properties);
	},
	logout(reason: string) {
		posthog()?.capture('logout', { reason });
		posthog()?.reset();
	}
};
