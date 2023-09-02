import { Page, expect, test } from '@playwright/test';
import { assertCookie } from '../helpers';

const assertSelection = async (page: Page) => {
	await expect(page.locator('#gameSelector > option.selected')).toHaveText('Black 2 / White 2');
	await assertCookie(page, 'selectedGame', 'black2-white2');
};

export const navigateToSettings = async (page: Page) => {
	await page.goto('/');
	await page.getByRole('button', { name: 'Settings' }).click();
	await expect(page).toHaveURL('/settings');
};

test('the changed setting persists when navigating through pages', async ({ page }) => {
	await navigateToSettings(page);
	await page.locator('#gameSelector').selectOption({ label: 'Black 2 / White 2' });

	await page.goto('/');
	await page.goto('/settings');
	await assertSelection(page);
});

test('the changed setting persists when navigating with client side nav', async ({ page }) => {
	await navigateToSettings(page);
	await page.locator('#gameSelector').selectOption({ label: 'Black 2 / White 2' });

	await page.getByTestId('navbarBrandingTitle').click();
	expect(page).toHaveURL('/');
	await page.getByRole('button', { name: 'Settings' }).click();
	await assertSelection(page);
});
