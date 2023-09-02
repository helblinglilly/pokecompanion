import { test, expect } from '@playwright/test';
import { assertCookie } from './helpers';

test('the user can navigate to the homepage', async ({ page }) => {
	await page.goto('/');
	const isElementVisible = await page.isVisible('nav');
	expect(isElementVisible).toBe(true);
});

test('the user can navigate to the settings page', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('button', { name: 'Settings' }).click();
	await expect(page).toHaveURL('/settings');
});
