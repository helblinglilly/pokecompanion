import { test, expect } from '@playwright/test';

test.beforeEach(async ({ page }) => {
	await page.context().clearCookies();
})

test('Pokemon page can be rendered when selectedGame is generic', async ({ page }) => {
	await page
		.context()
		.addCookies([{ name: 'selectedGame', value: 'generic', domain: 'localhost', path: '/' }]);
	await page.goto('/pokemon/25', { waitUntil: 'networkidle' });

	const locator = page.locator('#pokemonName');
	await expect(locator).toHaveText('Pikachu');
});

test('When Pokemon is not in game, will display correct, relative data', async ({ page }) => {
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

test('Will respect language, game and variety', async ({ page }) => {
	// // Bulbasaur
	await page.goto('/pokemon/1?game=black-2-white-2&primaryLanguage=de&secondaryLanguage=fr', { waitUntil: 'networkidle' });
	
	// // Ensure languages are being respected
	// page.getByRole('heading', { name: 'Bisasam - Bulbizarre' });

	// // Ensure sprite is version specific
	const primarySpriteBulbasaur = page.locator('#primarySprite');
	const bulbasaurSpriteURL = await primarySpriteBulbasaur.getAttribute('src');
	expect(bulbasaurSpriteURL).toBe('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/versions/generation-v/black-white/animated/1.gif');

	// // Ensure variety
	await page.goto('/pokemon/25?variety=pikachu-gmax', { waitUntil: 'networkidle' });
	page.getByRole('heading', { name: 'Gigadynamax-Pikachu - Pikachu Gigamax' });
	
	const primarySpritePikachuGmax = page.locator('#primarySprite');
	const pikachuGmaxSpriteURL = await primarySpritePikachuGmax.getAttribute('src');
	expect(pikachuGmaxSpriteURL).toBe('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10199.png');
})
