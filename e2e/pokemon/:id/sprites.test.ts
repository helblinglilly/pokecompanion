
import test, { expect } from "@playwright/test";

test.describe('Basic happy path', () => {
    test('Returns the expected URL for the plain Pikachu route', async ({ page }) => {
        const response = await page.goto("/api/pokemon/25/sprite");
        await expect(page.locator('pre')).toContainText('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png');

        const headers = response?.headers();
        expect(headers).toHaveProperty("content-type", "text/plain");
        expect(headers).toHaveProperty("cache-control", "public, max-age=86400, s-maxage=86400");

        expect(headers).toHaveProperty("x-has-shiny", "true")
        expect(headers).toHaveProperty("x-has-female", "true")
        expect(headers).toHaveProperty("x-matches-form", "true");
        expect(headers).toHaveProperty("x-matches-variety", "true");

    })

    test('?image=true returns a .png', async ({ page} ) => {
        const response = await page.goto("/api/pokemon/25/sprite?image=true");
        const headers = response?.headers();
        expect(headers).toHaveProperty("content-type", "image/png");
    });
})

test.describe('?shiny=boolean', () => {
    test('true - Pikachu - Returns the expected response when a shiny form exists', async ({ page }) => {
        const response = await page.goto("/api/pokemon/25/sprite?shiny=true");
        await expect(page.locator('pre')).toContainText('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/25.png');
        
        const headers = response?.headers();
        expect(headers).toHaveProperty("content-type", "text/plain");
        expect(headers).toHaveProperty("cache-control", "public, max-age=86400, s-maxage=86400");
        
        expect(headers).toHaveProperty("x-has-shiny", "true")
        expect(headers).toHaveProperty("x-has-female", "true")
        expect(headers).toHaveProperty("x-matches-form", "true");
        expect(headers).toHaveProperty("x-matches-variety", "true");
        expect(headers).toHaveProperty("x-alt-text", "Front Shiny");
        expect(headers).toHaveProperty("x-is-back", "false");
    });

    test('false - Pikachu - Returns the basic sprite', async ({ page }) => {
        const response = await page.goto("/api/pokemon/25/sprite?shiny=false");
        await expect(page.locator('pre')).toContainText('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png');
        
        const headers = response?.headers();
        expect(headers).toHaveProperty("content-type", "text/plain");
        expect(headers).toHaveProperty("cache-control", "public, max-age=86400, s-maxage=86400");
        
        expect(headers).toHaveProperty("x-has-shiny", "true")
        expect(headers).toHaveProperty("x-has-female", "true")
        expect(headers).toHaveProperty("x-matches-form", "true");
        expect(headers).toHaveProperty("x-matches-variety", "true");
        expect(headers).toHaveProperty("x-alt-text", "Front");
        expect(headers).toHaveProperty("x-is-back", "false");
    });
})

test.describe('?variety=string', () => {
    test.describe('Unown C', () => {
        test('Responds with the correct sprite and headers for its varieties', async ({ page }) => {
            const response = await page.goto("/api/pokemon/201/sprite?variety=unown-c");
            await expect(page.locator('pre')).toContainText('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/201-c.png');
            
            const headers = response?.headers();
            expect(headers).toHaveProperty("content-type", "text/plain");
            expect(headers).toHaveProperty("cache-control", "public, max-age=600, s-maxage=600");
            
            expect(headers).toHaveProperty("x-has-shiny", "true")
            expect(headers).toHaveProperty("x-matches-form", "true");
            expect(headers).toHaveProperty("x-matches-variety", "false");
            expect(headers).toHaveProperty("x-alt-text", "Front Unown C");
        })
    })
    test('Keldeo - Also treats variety as form', async ({ page }) => {
        const response = await page.goto("/api/pokemon/647/sprite?variety=keldeo-resolute");
        await expect(page.locator('pre')).toContainText('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10024.png');
            
        const headers = response?.headers();
        expect(headers).toHaveProperty("content-type", "text/plain");
        expect(headers).toHaveProperty("cache-control", "public, max-age=86400, s-maxage=86400");
        
        expect(headers).toHaveProperty("x-has-shiny", "true")
        expect(headers).toHaveProperty("x-matches-form", "true");
        expect(headers).toHaveProperty("x-matches-variety", "true");
    })
    test.describe('Spike Eared Pichu - When the variety is valid but no sprite exists', () => {
        test('404s', async ({ page }) => {
            const response = await page.goto("/api/pokemon/172/sprite?variety=pichu-spiky-eared");
            expect(response?.status()).toBe(404);
        });
    })

    test.describe('&shiny=true', () => {
        test('Unown C', async ({ page }) => {
            const response = await page.goto("/api/pokemon/201/sprite?variety=unown-c&shiny=true");
            await expect(page.locator('pre')).toContainText('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/201-c.png');
            
            const headers = response?.headers();
            expect(headers).toHaveProperty("content-type", "text/plain");
            expect(headers).toHaveProperty("cache-control", "public, max-age=600, s-maxage=600");
            
            expect(headers).toHaveProperty("x-has-shiny", "true")
            expect(headers).toHaveProperty("x-matches-form", "true");
            expect(headers).toHaveProperty("x-matches-variety", "false");
            expect(headers).toHaveProperty("x-alt-text", "Front Shiny Unown C");
        })
    })
})

test.describe('?gender=male|female|undefined', () => {
    test.describe('female', () => {
        test.describe('Lickilicky - When the Pokemon has no gender differences', () => {
            test('female - returns male version', async ({ page }) => {
                const response = await page.goto("/api/pokemon/463/sprite?gender=female");
                await expect(page.locator('pre')).toContainText('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/463.png');
                
                const headers = response?.headers();
                expect(headers).toHaveProperty("content-type", "text/plain");
                expect(headers).toHaveProperty("cache-control", "public, max-age=600, s-maxage=600");
                
                expect(headers).toHaveProperty("x-has-shiny", "true")
                expect(headers).toHaveProperty("x-matches-form", "true");
                expect(headers).toHaveProperty("x-matches-variety", "true");
                expect(headers).toHaveProperty("x-has-female", "false")
                expect(headers).toHaveProperty("x-alt-text", "Front");
            });

            test('male - returns male version as exact match', async ({ page }) => {
                const response = await page.goto("/api/pokemon/463/sprite?gender=male");
                await expect(page.locator('pre')).toContainText('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/463.png');
                
                const headers = response?.headers();
                expect(headers).toHaveProperty("content-type", "text/plain");
                expect(headers).toHaveProperty("cache-control", "public, max-age=86400, s-maxage=86400");
                
                expect(headers).toHaveProperty("x-has-shiny", "true")
                expect(headers).toHaveProperty("x-has-female", "false")
                expect(headers).toHaveProperty("x-matches-form", "true");
                expect(headers).toHaveProperty("x-matches-variety", "true");
                expect(headers).toHaveProperty("x-alt-text", "Front");
            });
        })

        test.describe('Venusaur', () => {
            test('female - returns female version', async ({ page }) => {
                const response = await page.goto("/api/pokemon/3/sprite?gender=female");
                await expect(page.locator('pre')).toContainText('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/female/3.png');
                
                const headers = response?.headers();
                expect(headers).toHaveProperty("content-type", "text/plain");
                expect(headers).toHaveProperty("cache-control", "public, max-age=86400, s-maxage=86400");
                
                expect(headers).toHaveProperty("x-has-shiny", "true")
                expect(headers).toHaveProperty("x-matches-form", "true");
                expect(headers).toHaveProperty("x-matches-variety", "true");
                expect(headers).toHaveProperty("x-has-female", "true")
                expect(headers).toHaveProperty("x-alt-text", "Front Female");
            });

            test('male - returns male version as exact match', async ({ page }) => {
                const response = await page.goto("/api/pokemon/3/sprite?gender=male");
                await expect(page.locator('pre')).toContainText('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/3.png');
                
                const headers = response?.headers();
                expect(headers).toHaveProperty("content-type", "text/plain");
                expect(headers).toHaveProperty("cache-control", "public, max-age=86400, s-maxage=86400");
                
                expect(headers).toHaveProperty("x-has-shiny", "true")
                expect(headers).toHaveProperty("x-has-female", "true")
                expect(headers).toHaveProperty("x-matches-form", "true");
                expect(headers).toHaveProperty("x-matches-variety", "true");
                expect(headers).toHaveProperty("x-alt-text", "Front");
            });

            test('shiny - returns the shiny version', async ({ page }) => {
                const response = await page.goto("/api/pokemon/3/sprite?gender=female&shiny=true");
                await expect(page.locator('pre')).toContainText('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/female/3.png');
                
                const headers = response?.headers();
                expect(headers).toHaveProperty("content-type", "text/plain");
                expect(headers).toHaveProperty("cache-control", "public, max-age=86400, s-maxage=86400");
                
                expect(headers).toHaveProperty("x-has-shiny", "true")
                expect(headers).toHaveProperty("x-matches-form", "true");
                expect(headers).toHaveProperty("x-matches-variety", "true");
                expect(headers).toHaveProperty("x-has-female", "true")
                expect(headers).toHaveProperty("x-alt-text", "Front Shiny Female");
            })

            test.describe('variety - Gigantamax', () => {
                test('Female falls back to male', async ({ page }) => {
                    // No Pokemon with regional gender differences exists
                    const response = await page.goto("/api/pokemon/3/sprite?gender=female&variety=venusaur-gmax");
                    await expect(page.locator('pre')).toContainText('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/10195.png');
                    
                    const headers = response?.headers();
                    expect(headers).toHaveProperty("content-type", "text/plain");
                    expect(headers).toHaveProperty("cache-control", "public, max-age=600, s-maxage=600");
                    
                    expect(headers).toHaveProperty("x-has-shiny", "true")
                    expect(headers).toHaveProperty("x-matches-form", "true");
                    expect(headers).toHaveProperty("x-matches-variety", "true");
                    expect(headers).toHaveProperty("x-has-female", "false")
                    expect(headers).toHaveProperty("x-alt-text", "Front Venusaur Gmax");
                })

                test('Male Shiny', async ({ page }) => {
                    const response = await page.goto("/api/pokemon/3/sprite?gender=male&shiny=true&variety=venusaur-gmax");
                    await expect(page.locator('pre')).toContainText('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/shiny/10195.png');
                    
                    const headers = response?.headers();
                    expect(headers).toHaveProperty("content-type", "text/plain");
                    expect(headers).toHaveProperty("cache-control", "public, max-age=86400, s-maxage=86400");
                    
                    expect(headers).toHaveProperty("x-has-shiny", "true")
                    expect(headers).toHaveProperty("x-matches-form", "true");
                    expect(headers).toHaveProperty("x-matches-variety", "true");
                    expect(headers).toHaveProperty("x-has-female", "false")
                    expect(headers).toHaveProperty("x-alt-text", "Front Shiny Venusaur Gmax");
                })
            })
        })
    })
})

test.describe('?direction=back', () => {
    test('Pikachu - non-expected value returns front sprite', async ({ page }) => {
        const response = await page.goto("/api/pokemon/25/sprite?direction=front");
        await expect(page.locator('pre')).toContainText('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/25.png');
        
        const headers = response?.headers();
        expect(headers).toHaveProperty("content-type", "text/plain");
        expect(headers).toHaveProperty("cache-control", "public, max-age=86400, s-maxage=86400");
        
        expect(headers).toHaveProperty("x-has-shiny", "true")
        expect(headers).toHaveProperty("x-is-back", "false")
        expect(headers).toHaveProperty("x-matches-form", "true");
        expect(headers).toHaveProperty("x-matches-variety", "true");
        expect(headers).toHaveProperty("x-alt-text", "Front");
    })

    test('Pikachu - Returns the back sprite for a Pokemon', async({ page }) => {
        const response = await page.goto("/api/pokemon/25/sprite?direction=back");
        await expect(page.locator('pre')).toContainText('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/25.png');
        
        const headers = response?.headers();
        expect(headers).toHaveProperty("content-type", "text/plain");
        expect(headers).toHaveProperty("cache-control", "public, max-age=86400, s-maxage=86400");
        
        expect(headers).toHaveProperty("x-has-shiny", "true")
        expect(headers).toHaveProperty("x-is-back", "true")
        expect(headers).toHaveProperty("x-matches-form", "true");
        expect(headers).toHaveProperty("x-matches-variety", "true");
        expect(headers).toHaveProperty("x-alt-text", "Back");
    })

    test('Shiny', async ({ page }) => {
        const response = await page.goto("/api/pokemon/25/sprite?direction=back&shiny=true");
        await expect(page.locator('pre')).toContainText('https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/back/shiny/25.png');
        
        const headers = response?.headers();
        expect(headers).toHaveProperty("content-type", "text/plain");
        expect(headers).toHaveProperty("cache-control", "public, max-age=86400, s-maxage=86400");
        
        expect(headers).toHaveProperty("x-has-shiny", "true")
        expect(headers).toHaveProperty("x-is-back", "true")
        expect(headers).toHaveProperty("x-matches-form", "true");
        expect(headers).toHaveProperty("x-matches-variety", "true");
        expect(headers).toHaveProperty("x-alt-text", "Back Shiny");
    })

    test.describe('Female', () => {
        test.skip('Returns the female back sprite', async ({ page }) => {

        })
        test.skip('Shiny', async ({ page }) => {

        })
    })

    test.describe('Variety', () => {
        test.skip('Returns the back Mega sprite', async ({ page }) => {

        })

        test.skip('Shiny - Returns the shiny back Mega sprite', async ({ page }) => {

        })
    })
})
