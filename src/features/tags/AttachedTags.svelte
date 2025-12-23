<script lang="ts">
	import { currentUser } from '$lib/stores/user';
	import Icon from '$/ui/atoms/Icon.svelte';
	import type { ITagMove } from '$/@types/api.pokecompanion';
	import { page } from '$app/state';
	import type { LayoutData } from '../../routes/$types';
	import type { MinimalTagPokemon } from './types';
	import { doesTagContainPokemon } from './utils/containsPokemon';

	let {
		pokemon = undefined,
		move = undefined
	}: {
		pokemon?: MinimalTagPokemon;
		move?: Omit<ITagMove, 'added'> | undefined;
	} = $props();

	let tags = $derived(
		(page.data as LayoutData).tags?.tags ||
			[].filter((tag) => {
				if (pokemon) {
					return doesTagContainPokemon(tag, pokemon);
				}
			})
	);
</script>

{#each tags as tag}
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
