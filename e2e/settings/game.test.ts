import { Page, expect, test } from '@playwright/test';
import { assertCookie } from '../helpers';

export const navigateToSettings = async (page: Page) => {
	await page.goto('/');
	await page.getByRole('button', { name: 'Settings' }).click();
	await expect(page).toHaveURL('/settings');
};

const assertSelection = async (page: Page) => {
	await expect(page.locator('#gameSelector > option.selected')).toHaveText('Black 2 / White 2');
	await assertCookie(page, 'selectedGame', 'black-2-white-2');
};

test('has a default value "Generic"', async ({ page }) => {
	await page.goto('/settings');
	await expect(page.locator('#gameSelector > option.selected')).toHaveText('Generic');
});

test('the user can change the selected game', async ({ page }) => {
	await navigateToSettings(page);
	await page.locator('#gameSelector').selectOption({ label: 'Black 2 / White 2' });
	await assertSelection(page);
});
