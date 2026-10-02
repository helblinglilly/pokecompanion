# Pokécompanion

<a href="https://pokecompanion.com">
  <img align="left" width="100" height="100" src="https://pokecompanion.com/favicon.png" style="padding-bottom: 20px;">
</a>
<h4>Your companion through the world of Pokemon</h4>
<a href="https://github.com/helblinglilly/pokecompanion/commits/main"><img src="https://badgen.net/github/commits/helblinglilly/pokecompanion/main"></a>
<a href="https://github.com/helblinglilly/pokecompanion/commits/main"><img src="https://badgen.net/github/last-commit/helblinglilly/pokecompanion/main"></a>
<div/>
<a href="https://pokecompanion.com">www.pokecompanion.com</a>

<br />

<br />

![Pokemon Page](.github/screenshots/pokemon-page.jpg)

## Getting started

```sh
cp .env.example .env
# Change any values as required

npm i
npm run schema
npm run dev
```

## Deploying to Cloudflare Pages

This project is deployed as a Cloudflare Pages project through Wrangler. `wrangler.jsonc` owns the Pages project name, build output directory, compatibility date, and compatibility flags. The SvelteKit Cloudflare adapter writes the deployable Worker and static assets to `.svelte-kit/cloudflare`.

```sh
# Authenticate once when developing locally
npx wrangler login

# Deploy the `develop` preview branch
npm run deploy:preview

# Deploy the `main` production branch
npm run deploy:production
```

The existing Pages project must be named `pokecompanion`, with `main` configured as its production branch. The compatibility date and `nodejs_compat` flag are declared in `wrangler.jsonc`.

Configure environment bindings in **Cloudflare Pages → pokecompanion → Settings → Environment variables**, separately for Production and Preview. The application currently declares `PUBLIC_API_HOST`, `PUBLIC_ENVIRONMENT`, `PUBLIC_POSTHOG_KEY`, and `DISCORD_WEBHOOK_URL` in `src/env.ts`; `DISCORD_WEBHOOK_URL` is a required secret for the feedback endpoint. Use secret bindings for non-public values; do not place credentials in `wrangler.toml`, `package.json`, or committed `.env` files. `wrangler pages secret put <KEY> --project-name pokecompanion` is available for project-level secret updates.

> The previous infrastructure configuration contained credential values. Rotate those values and remove them from Terraform state/configuration before using this workflow.

## A new ??? has released! Where is it?

We scrape Pokeapi on a weekly basis, which should surface any new data in search.

Otherwise, trying to access that Pokemon/Item/Ability/Move should be able to surface any Pokeapi data - if it exists.
