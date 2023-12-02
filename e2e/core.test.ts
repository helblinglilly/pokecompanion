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

test('Pokemon page can be rendered without any cookies', async ({ page }) => {
	await page.context().clearCookies();
	await page.goto('/pokemon/25', { waitUntil: 'networkidle' });

	const locator = page.locator('#pokemonName');
	await expect(locator).toHaveText('Pikachu');

	await page.getByRole('link', { name: '#26 icon' }).click();
	expect(page).toHaveURL('/pokemon/26');
});
