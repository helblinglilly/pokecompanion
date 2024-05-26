import {  expect, test } from '@playwright/test';
import { assertCookie } from '../helpers';

test('has a default value "Generic"', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('button', { name: 'Settings' }).click();
	await expect(page).toHaveURL('/settings');

	await expect(page.locator('#gameSelector > option.selected')).toHaveText('-');
});

test('the user can change the selected game', async ({ page }) => {
	// Go to settings
	await page.goto('/');
	await page.context().addCookies([{ name: 'selectedGame', value: 'black-2-white-2', path: '/', domain: 'localhost'}])
	await page.getByRole('button', { name: 'Settings' }).click();
	await expect(page).toHaveURL('/settings');

	// Assert that option has been initialised from cookies
	await expect(page.locator('#gameSelector > option.selected')).toHaveText('Black 2 / White 2');

	// Change value and assert that it was actioned
	await page.selectOption('#gameSelector', { label: 'X / Y'});
	await expect(page.locator('#gameSelector > option.selected')).toHaveText('X / Y');
	await assertCookie(page, 'selectedGame', 'x-y');
});
