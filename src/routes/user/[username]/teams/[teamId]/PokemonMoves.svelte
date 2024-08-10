<script lang="ts">
	import type { IGameGroups } from '$/lib/data/games';
	import type { IBasePokemon } from '$/lib/types/ITeams';
	import { getMoveName } from '$/ui/atoms/move/helpers';

	export let pokemon: IBasePokemon;
	export let game: IGameGroups | undefined;
</script>

<div class="grid md:grid-cols-2 gap-2">
	<p>
		{#await getMoveName(pokemon.move1, game)}
			Loading...
		{:then name}
			{name}
		{/await}
	</p>
	<p>
		{#await getMoveName(pokemon.move2, game)}
			Loading...
		{:then name}
			{name}
		{/await}
	</p>
	<p>
		{#await getMoveName(pokemon.move3, game)}
			Loading...
		{:then name}
			{name}
		{/await}
	</p>
	<p>
		{#await getMoveName(pokemon.move4, game)}
			Loading...
		{:then name}
			{name}
		{/await}
	</p>
</div>
