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

test('the user can navigate to the about page', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('button', { name: 'About' }).click();
	await expect(page).toHaveURL('/about');
});

test('the user can navigate to the sign in page', async ({ page }) => {
	await page.goto('/');
	await page.getByRole('button', { name: 'Sign In' }).click();
	await expect(page).toHaveURL('/auth/signin');
	expect(page.getByRole('button', { name: 'Continue with Google' })).toBeVisible();
});
