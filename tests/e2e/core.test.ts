import { test, expect } from '@playwright/test';
import { assertCookie } from './helpers';

test('the user can navigate to the homepage', async ({ page }) => {
	await page.goto('/');
	const isElementVisible = await page.isVisible('nav');
	expect(isElementVisible).toBe(true);
});

test('the user can visit to the settings page and settings persist when navigating', async ({
	page
}) => {
	// Navigate to settings
	await page.goto('/');
	await page.getByRole('button', { name: 'Settings' }).click();
	await expect(page).toHaveURL('/settings');

	// Select a Game from the options
	await page.getByRole('combobox').selectOption({ label: 'Black 2 / White 2' });

	// Check that a cookie has been set
	await assertCookie(page, 'selectedGame', 'black2-white2');

	// Check that the display value has updated
	await expect(page.locator('option.selected')).toHaveText('Black 2 / White 2');

	// Get to page again through client side nav
	await page.getByTestId('navbarBrandingTitle').click();
	await page.getByRole('button', { name: 'Settings' }).click();

	// Check values
	await expect(page.locator('option.selected')).toHaveText('Black 2 / White 2');
	await assertCookie(page, 'selectedGame', 'black2-white2');

	// Check through regular navigation
	await page.goto('/');
	await page.goto('/settings');

	// Check values
	await expect(page.locator('option.selected')).toHaveText('Black 2 / White 2');
	await assertCookie(page, 'selectedGame', 'black2-white2');
});
