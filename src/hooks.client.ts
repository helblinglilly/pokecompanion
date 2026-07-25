import { PUBLIC_ENVIRONMENT } from '$env/static/public';
import { BrowserAgent } from '@newrelic/browser-agent/loaders/browser-agent';

const ACCOUNT_ID = '4391691';
const LICENSE_KEY = 'NRJS-814f95c36967f82d131';
const PRODUCTION_APPLICATION_ID = '538581304';
const PREVIEW_APPLICATION_ID = '538581605';
const NEW_RELIC_BEACON = 'bam.eu01.nr-data.net';
const NEW_RELIC_PROXY = 'newrelic.pokecompanion.com';

const isProductionHost = ['pokecompanion.com', 'www.pokecompanion.com'].includes(
	window.location.hostname
);
const applicationID = isProductionHost ? PRODUCTION_APPLICATION_ID : PREVIEW_APPLICATION_ID;

if (PUBLIC_ENVIRONMENT !== 'local') {
	new BrowserAgent({
		init: {
			distributed_tracing: { enabled: true },
			privacy: { cookies_enabled: true },
			proxy: { beacon: NEW_RELIC_PROXY }
		},
		info: {
			beacon: NEW_RELIC_BEACON,
			errorBeacon: NEW_RELIC_BEACON,
			licenseKey: LICENSE_KEY,
			applicationID,
			sa: 1
		},
		loader_config: {
			accountID: ACCOUNT_ID,
			trustKey: ACCOUNT_ID,
			agentID: applicationID,
			licenseKey: LICENSE_KEY,
			applicationID
		}
	});
}
