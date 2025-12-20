/**
 * AI generated - Can't use uuid package with Svelte5 on cloudflare
 * Generate a v4 UUID using Web Crypto API
 * This is compatible with Cloudflare Workers and other edge runtimes
 */
export function uuid(): string {
	// Use crypto.randomUUID if available (modern browsers and Node 19+)
	if (typeof crypto !== 'undefined' && crypto.randomUUID) {
		return crypto.randomUUID();
	}

	// Fallback implementation using crypto.getRandomValues
	if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
		const bytes = crypto.getRandomValues(new Uint8Array(16));

		// Set version (4) and variant bits
		// @ts-expect-error Will have length of 16
		bytes[6] = (bytes[6] & 0x0f) | 0x40;
		// @ts-expect-error Will have length of 16
		bytes[8] = (bytes[8] & 0x3f) | 0x80;

		// Convert to hex string with dashes
		const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');

		return [
			hex.substring(0, 8),
			hex.substring(8, 12),
			hex.substring(12, 16),
			hex.substring(16, 20),
			hex.substring(20, 32)
		].join('-');
	}

	// Final fallback for environments without crypto (should rarely happen)
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
		const r = (Math.random() * 16) | 0;
		const v = c === 'x' ? r : (r & 0x3) | 0x8;
		return v.toString(16);
	});
}
