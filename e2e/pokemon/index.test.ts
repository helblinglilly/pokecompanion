import { expect, test } from '@playwright/test';

test('Can collapse the expanded entries', async ({ page }) => {
	await page.goto('/pokemon');
	await expect(page.getByRole('link', { name: 'bulbasaur sprite #1 Bulbasaur' })).toBeVisible();

	await page.getByRole('button', { name: 'Generation 1 #1 - #151' }).click();

	await expect(page.getByRole('link', { name: 'bulbasaur sprite #1 Bulbasaur' })).not.toBeVisible();
});
