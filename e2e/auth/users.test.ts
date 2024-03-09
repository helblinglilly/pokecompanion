import { expect, test } from '@playwright/test';

test('Can load a users profile', async ({ page }) => {
	await page.goto('/user/users62794');
	await page.waitForFunction(() => document.readyState === 'complete');

	const tagHeader = page.getByText('Tag lists');
	expect(tagHeader).toBeTruthy();

	await page.getByRole('link', { name: 'BDSP Team (6 entries)' }).click();
	await page.waitForFunction(() => document.readyState === 'complete');

	expect(page.url()).toContain('user/users62794/tags/e5io1v0x8y6o1lo');
});
