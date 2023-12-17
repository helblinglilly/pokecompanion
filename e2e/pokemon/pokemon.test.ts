import { test, expect } from '@playwright/test';

test('Pokemon page can be rendered when selectedGame is generic', async ({ page }) => {
	await page.context().clearCookies();
	await page
		.context()
		.addCookies([{ name: 'selectedGame', value: 'generic', domain: 'localhost', path: '/' }]);
	await page.goto('/pokemon/25', { waitUntil: 'networkidle' });

	const locator = page.locator('#pokemonName');
	await expect(locator).toHaveText('Pikachu');
});

test('When Pokemon is not in game, will display correct, relative data', async ({ page }) => {
	await page.context().clearCookies();
	await page
		.context()
		.addCookies([{ name: 'selectedGame', value: 'black-white', domain: 'localhost', path: '/' }]);

	// State that Tinkaton is not in B/W
	await page.goto('/pokemon/957', { waitUntil: 'networkidle' });
	page.getByText('Not in Black & White').first();
	page.getByText('Not in Black & White').nth(1);

	// Confirm that in Gen 5, it's Normal type, not Fairy as this didn't exist yet
	await page.goto('/pokemon/35', { waitUntil: 'networkidle' });
	page.getByRole('img', { name: 'normal' });
});

test('Will update the URL when different forms are selected', async ({ page }) => {
	await page.context().clearCookies();

	// Wooper
	await page.goto('/pokemon/194', { waitUntil: 'networkidle' });
	page.getByRole('heading', { name: 'Wooper' });

	page.getByTestId('genderToggle').click();
	await page.waitForURL('**/pokemon/194?gender=female');
	page.getByTestId('shinyToggle').click();
	await page.waitForURL('**/pokemon/194?gender=female&shiny=true');
	await page.locator('#formSelector-desktop').selectOption({ label: 'Paldea' });
	await page.waitForURL('**/pokemon/194?gender=female&shiny=true&variety=wooper-paldea');

	// Name on page updates
	page.getByRole('heading', { name: 'Paldea Wooper' });

	// Remove the variety if reverting back to default
	await page.locator('#formSelector-desktop').selectOption({ label: 'Default' });
	await page.waitForURL('**/pokemon/194?gender=female&shiny=true');

	// Once modified - keep it specific
	page.getByTestId('genderToggle').click();
	await page.waitForURL('**/pokemon/194?gender=male&shiny=true');

	page.getByTestId('shinyToggle').click();
	await page.waitForURL('**/pokemon/194?gender=male&shiny=false');
});
