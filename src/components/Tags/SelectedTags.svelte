<script lang="ts">
	import { currentUser } from '$lib/stores/user';
	import Icon from '$/components/UI/Icon.svelte';
	import { doesTagContainMove, doesTagContainPokemon, tagStore } from '$lib/stores/tags';
	import { type IDisplayPokemon } from '$lib/stores/pokemonPage';
	import type { ITagMove } from '$/routes/api/tag/types';

	export let pokemon: IDisplayPokemon | undefined = undefined;
	export let move: ITagMove | undefined = undefined;

	$: currentTags = $tagStore.filter((tag) => {
		if (tag.isHiddenAcrossSite) {
			return false;
		}
		if (pokemon) {
			return doesTagContainPokemon(pokemon, tag);
		} else if (move) {
			return doesTagContainMove(move, tag);
		}
		return false;
	});

	// onMount(async () => {
	// Here because for Pokemon, we want to move this to the page.ts action
	// But this has not been done for moves yet
	// Every _page_ that displays tags, should manage the refetching so this can be
	// tied to the level that manages it
	// if (!pokemon) {
	// await refetchTags(userId);
	// }
	// });
</script>

{#each currentTags as tag}
	<a
		class="tag inline-flex gap-1 p-2 w-max m-1"
		href={`/user/${$currentUser?.username}/tags/${tag.id}#${
			move ? `move-${move.id}` : pokemon ? pokemon.id : ''
		}`}
	>
		<Icon style="margin-top: auto; margin-bottom: auto;" name="tag" />
		<p>{tag.name}</p>
	</a>
{/each}

<style>
	.tag {
		font-size: smaller;
		background-color: var(--card-hover);
		border-radius: 3rem;
		text-decoration: none;
	}
</style>
