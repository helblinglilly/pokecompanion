import { expect, test } from '@playwright/test';

test.skip('Login flow validates passwords before ', async ({ page }) => {
	await page.goto('/auth/signin');

	await page.getByLabel('Email').fill('test@user.com');
	await page.getByLabel('Password', { exact: true }).fill('NotValidPassword');
	await page.getByRole('button', { name: 'Log in' }).click();

	expect(page.getByText('Must contain:')).toBeVisible();
});

test.skip('Login works', async ({ page }) => {
	await page.goto('/auth/signin');

	await page.getByLabel('Email').fill('test@user.com');
	await page.getByLabel('Password', { exact: true }).fill('ValidPassword1*');

	await page.route('*/**auth?/login', async (route) => {
		console.log('hello');
		await route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({
				type: 'success',
				status: 204,
				data: '-1'
			}),
			headers: {
				'set-cookie':
					'pb_auth%3D%7B%22token%22%3A%22eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJfcGJfdXNlcnNfYXV0aF8iLCJleHAiOjE2OTg3ODM3NzQsImlkIjoidXBkNHdoeGNnMHJjMXc4IiwidHlwZSI6ImF1dGhSZWNvcmQifQ.NEGuNNs2JDsz7DlJww8eMHjHy1EPXk3tiGFqmQ3r8wo%22%2C%22model%22%3A%7B%22avatar%22%3A%22%22%2C%22collectionId%22%3A%22_pb_users_auth_%22%2C%22collectionName%22%3A%22users%22%2C%22created%22%3A%222023-10-17+20%3A22%3A47.164Z%22%2C%22email%22%3A%22test%40user.com%22%2C%22emailVisibility%22%3Afalse%2C%22id%22%3A%22upd4whxcg0rc1w8%22%2C%22name%22%3A%22%22%2C%22updated%22%3A%222023-10-17+20%3A22%3A47.164Z%22%2C%22username%22%3A%22test%22%2C%22verified%22%3Afalse%7D%7D%3B+Path%3D%2F%3B+Expires%3DThu%2C+31+Dec+2099+01%3A00%3A00+GMT%3B+Secure%3B+SameSite%3DStrict'
			}
		});
	});

	await page.route('*/**/auth/signin', async (route) => {
		console.log('hello signin');
		await route.fulfill({
			status: 200,
			contentType: 'application/json',
			body: JSON.stringify({
				type: 'success',
				status: 204,
				data: '-1'
			}),
			headers: {
				'set-cookie':
					'pb_auth%3D%7B%22token%22%3A%22eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJjb2xsZWN0aW9uSWQiOiJfcGJfdXNlcnNfYXV0aF8iLCJleHAiOjE2OTg3ODM3NzQsImlkIjoidXBkNHdoeGNnMHJjMXc4IiwidHlwZSI6ImF1dGhSZWNvcmQifQ.NEGuNNs2JDsz7DlJww8eMHjHy1EPXk3tiGFqmQ3r8wo%22%2C%22model%22%3A%7B%22avatar%22%3A%22%22%2C%22collectionId%22%3A%22_pb_users_auth_%22%2C%22collectionName%22%3A%22users%22%2C%22created%22%3A%222023-10-17+20%3A22%3A47.164Z%22%2C%22email%22%3A%22test%40user.com%22%2C%22emailVisibility%22%3Afalse%2C%22id%22%3A%22upd4whxcg0rc1w8%22%2C%22name%22%3A%22%22%2C%22updated%22%3A%222023-10-17+20%3A22%3A47.164Z%22%2C%22username%22%3A%22test%22%2C%22verified%22%3Afalse%7D%7D%3B+Path%3D%2F%3B+Expires%3DThu%2C+31+Dec+2099+01%3A00%3A00+GMT%3B+Secure%3B+SameSite%3DStrict'
			}
		});
	});

	await page.getByRole('button', { name: 'Log in' }).click();
});
