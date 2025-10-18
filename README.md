# Pokecompanion

Frontend for [pokecompanion.com](https://pokecompanion.com) built in SvelteKit 4, deployed as a Cloudflare pages project.

## Getting started

```sh
cp .env.example .env
# Change any values as required

npm i
npm run schema
npm run dev
```

## API

Parts of the API are still hosted within this project, others are hosted at [api.pokecompanion.com](https://api.pokecompanion.com/docs) which is managed through a private repo, although Swagger Docs are provided.

### Rationale behind splitting out the backend

- We started running into issues where Cloudflare requests exceed the maximum CPU time
- Observability tools are very limited and don't offer sufficient insight
- The Pocketbase instance runs on a single VPS. Rather than each worker (that's deployed across the world) reaching out to one single location, it makes more sense to have the backend as close to the DB as possible and have Cloudflare cache the responses as json

Furthermore, the data fetching approach throughout this project is inconsistent and this further complicates the migration to Svelte 5. Before re-writing UI components, we want to make sure they are as dumb as possible.

## New Pokémon have been released

1. Update `./src/build/scrapers/pokemon.js` to correctly allocate the new Pokedex IDs to a generation
2. Run `npm run scrape:pokemon` to update the source data
