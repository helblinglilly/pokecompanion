<script lang="ts">
	import { currentUser } from '$lib/stores/user';
	import Icon from '$components/UI/Icon.svelte';
	import {
		doesTagContainMove,
		doesTagContainPokemon,
		refetchTags,
		tagStore
	} from '$lib/stores/tagsStore';
	import { onMount } from 'svelte';
	import { type IDisplayPokemon } from '$lib/stores/pokemonPageStore';

	export let userId: string;
	export let pokemon: IDisplayPokemon | undefined = undefined;
	export let moveId: number | undefined = undefined;

	$: currentTags = $tagStore.filter((tag) => {
		if (pokemon) {
			return doesTagContainPokemon(pokemon, tag);
		} else if (moveId) {
			return doesTagContainMove(moveId, tag);
		}
		return false;
	});

	onMount(async () => {
		await refetchTags(userId);
	});
</script>

{#each currentTags as tag}
	{#if pokemon}
		<a class="tag" href={`/user/${$currentUser?.username}/tags/${tag.id}#${pokemon.id}`}>
			<Icon style="margin-top: auto; margin-bottom: auto;" name="tag" />
			<p>{tag.name}</p>
		</a>
	{/if}
	{#if moveId}
		<a class="tag" href={`/user/${$currentUser?.username}/tags/${tag.id}#move-${moveId}`}>
			<Icon style="margin-top: auto; margin-bottom: auto;" name="tag" />
			<p>{tag.name}</p>
		</a>
	{/if}
{/each}

<style>
	.tag {
		display: inline-flex;
		gap: 0.25rem;
		font-size: smaller;
		background-color: var(--secondary);
		padding: 0.5rem;
		width: max-content;
		border-radius: 3rem;
		margin: 0.25rem;
		text-decoration: none;
	}
</style>
