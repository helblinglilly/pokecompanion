<script lang="ts">
	import { currentUser } from '$lib/stores/user';
	import Icon from '$/ui/atoms/Icon.svelte';
	import { doesTagContainMove, doesTagContainPokemon, tagStore } from '$lib/stores/tags';
	import { type IDisplayPokemon } from '$lib/stores/pokemonPage';
	import type { ITagMove } from '$/@types/api.pokecompanion';

	interface Props {
		pokemon?: IDisplayPokemon | undefined;
		move?: Omit<ITagMove, 'added'> | undefined;
	}

	let { pokemon = undefined, move = undefined }: Props = $props();

	let currentTags = $derived(
		$tagStore.filter((tag) => {
			if (tag.isHiddenAcrossSite) {
				return false;
			}
			if (pokemon) {
				return doesTagContainPokemon(pokemon, tag);
			} else if (move) {
				return doesTagContainMove(move, tag);
			}
			return false;
		})
	);
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
