import { Page, expect, test } from '@playwright/test';
import { assertCookie } from '../helpers';

export const navigateToSettings = async (page: Page) => {
	await page.goto('/');
	await page.getByRole('button', { name: 'Settings' }).click();
	await expect(page).toHaveURL('/settings');
	await page.waitForLoadState('networkidle');
};

test('primary language has a default value "English"', async ({ page }) => {
	await navigateToSettings(page);
	await expect(page.locator('#primaryLanguageSelector > option.selected')).toHaveText('English');
	await assertCookie(page, 'primaryLanguage', 'en');
});

test('secondary language is not set by default', async ({ page }) => {
	await navigateToSettings(page);
	await expect(page.locator('#secondaryLanguageSelector > option.selected')).toHaveText('None');
	await assertCookie(page, 'secondaryLanguage', 'none');
});

test('can change languages', async ({ page }) => {
	await navigateToSettings(page);
	await page.getByLabel('Primary Language').selectOption('de');
	await assertCookie(page, 'primaryLanguage', 'de');
	await expect(page.locator('#primaryLanguageSelector > option.selected')).toHaveText(
		'German - Deutsch'
	);

	await page.getByLabel('Secondary Language').selectOption('fr');
	await assertCookie(page, 'secondaryLanguage', 'fr');
	await expect(page.locator('#secondaryLanguageSelector > option.selected')).toHaveText(
		'French - Français'
	);
});

test('changing the language will remove the option in the other', async ({ page }) => {
	await navigateToSettings(page);
	await page.locator('#primaryLanguageSelector').selectOption({ value: 'de' });

	await expect(page.locator('#secondaryLanguageSelector > option.disabled')).toHaveText(
		'German - Deutsch'
	);

	await page.locator('#secondaryLanguageSelector').selectOption({ label: 'English' });

	await expect(page.locator('#primaryLanguageSelector > option.disabled')).toHaveText('English');
});
