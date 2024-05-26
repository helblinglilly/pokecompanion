import { test, expect } from '@playwright/test';

test('a search can be performed and shows results', async ({ page }) => {
	await page.goto('/');
	await page.locator('#searchForm > input').fill('5');
	await page.getByRole('button', { name: 'Search' }).click();
	await expect(page).toHaveURL('/search?term=5');
	await page.getByRole('link', { name: 'Psyduck sprite #54 Psyduck' }).click();
	await page.getByRole('heading', { name: 'Psyduck' }).click();
	await expect(page).toHaveURL('/pokemon/54');
});

test('Pokemon page can be rendered without any cookies', async ({ page }) => {
	await page.context().clearCookies();
	await page.goto('/pokemon/25', { waitUntil: 'networkidle' });

	const locator = page.locator('#pokemonName');
	await expect(locator).toHaveText('Pikachu');

	await page.getByRole('link', { name: '#26 icon' }).click();

	await page.waitForURL('**/pokemon/26');
});
