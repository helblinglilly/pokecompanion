import { expect, type Page } from '@playwright/test';

const assertCookie = async (page: Page, name: string, value: string) => {
	const cookies = await page.context().cookies();
	const selectedCookies = cookies.find((cookie) => cookie.name === name);
	if (!selectedCookies) {
		expect(true).toBe(false);
		return;
	}
	expect(selectedCookies.value).toBe(value);
};

export { assertCookie };
