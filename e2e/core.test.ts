import { test, expect } from '@playwright/test';

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

test('a search can be performed and shows results', async ({ page }) => {
	await page.goto('/');
	await page.locator('#searchForm > input').fill('5');
	await page.getByRole('button', { name: 'Search' }).click();
	await expect(page).toHaveURL('/search?term=5');
	await page.getByRole('button', { name: 'Show more results...' }).click();
	await page.getByRole('link', { name: 'Dodrio sprite #85 Dodrio' }).click();
	await page.getByRole('heading', { name: 'Dodrio' }).click();
	await expect(page).toHaveURL('/pokemon/85');
});
