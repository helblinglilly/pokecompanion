<script lang="ts">
	import { currentUser } from '$lib/stores/user';
	import Icon from '$/ui/atoms/Icon.svelte';
	import type { ITagMove } from '$/@types/api.pokecompanion';
	import { page } from '$app/state';
	import type { LayoutData } from '../../routes/$types';
	import type { MinimalTagPokemon } from './types';
	import { doesTagContainEntry } from './utils/contains';

	let {
		pokemon = undefined,
		move = undefined
	}: {
		pokemon?: MinimalTagPokemon;
		move?: Omit<ITagMove, 'added'> | undefined;
	} = $props();

	let tags = $derived(
		((page.data as LayoutData).tags?.tags || []).filter((tag) => {
			return doesTagContainEntry(tag.contents, {
				pokemon,
				move
			});
		})
	);
</script>

{#each tags as tag}
	{@const baseUrl = `/user/${$currentUser?.username}/tags/${tag.id}`}
	{@const anchor = move ? `move-${move.id}` : pokemon ? pokemon.id : ''}
	<a class="tag inline-flex gap-1 p-2 w-max m-1" href={`${baseUrl}#${anchor}`}>
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
