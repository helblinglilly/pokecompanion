# A new Pokemon has been discovered

The PokeAPI will have some data available sooner or later.

There is a [lambda service](https://github.com/helblinglilly/pokecompanion-lambda) that runs on a cron schedule that will scrape the API. It will insert new entries into the DB, and a following service will compare the DB to the Github repo - triggering a new build if differences occur.

# A new game has been released

Add the relevant new info to `games.ts`

- games
- gameGroups

If a new generation has been added as well, make sure the `nationalDexEnd` has been adjusted in the previous generation.

Adjust the [worker](https://github.com/helblinglilly/pokecompanion-lambda/blob/main/worker.js#L193) to add a boundary for the previous generation

# Increase the cron frequency

[Supervisor](https://github.com/helblinglilly/aws/blob/main/pokecompanion-update-service.tf#L19)

[Rebuild](https://github.com/helblinglilly/aws/blob/main/pokecompanion-update-service.tf#L25)
