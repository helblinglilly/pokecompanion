<script lang="ts">
	import { currentUser } from '$lib/stores/user';
	import Icon from '$/ui/atoms/Icon.svelte';
	import { page } from '$app/state';
	import type { LayoutData } from '../../routes/$types';
	import type { MinimalTagPokemon } from './types';
	import { doesTagContainEntry } from './utils/contains';

	let {
		pokemon = undefined
	}: {
		pokemon?: MinimalTagPokemon;
	} = $props();

	let tags = $derived(
		((page.data as LayoutData).tags?.tags || []).filter((tag) => {
			return doesTagContainEntry(tag.contents, {
				pokemon
			});
		})
	);
</script>

{#each tags as tag}
	{@const baseUrl = `/user/${tag.owner}/tags/${tag.id}`}
	{@const anchor = pokemon ? pokemon.id : ''}
	<a class="tag inline-flex gap-1 p-2 w-max m-1" href={`${baseUrl}#${anchor}`}>
		<span class="tag-icon"><Icon name="tag" /></span>
		<p>{tag.name}</p>
	</a>
{/each}

<style>
	.tag {
		font-size: smaller;
		background-color: var(--card-hover);
		border-radius: 3rem;
	}

	a.tag[href] {
		text-decoration: none;
	}

	.tag-icon {
		display: inline-flex;
		margin-top: auto;
		margin-bottom: auto;
	}
</style>
