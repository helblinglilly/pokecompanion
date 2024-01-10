<script lang="ts">
	import { currentUser } from '$lib/stores/user';
	import Icon from '$components/UI/Icon.svelte';
	import { doesTagContainPokemon, refetchTags, tagStore } from '$lib/stores/tagsStore';
	import { onMount } from 'svelte';
	import { pokemonDisplayStore } from '$lib/stores/pokemonPageStore';

	export let userId: string;

	$: currentTags = $tagStore.filter((tag) => {
		return doesTagContainPokemon($pokemonDisplayStore, tag);
	});

	onMount(async () => {
		await refetchTags(userId);
	});
</script>

{#each currentTags as tag}
	<a class="tag" href={`/user/${$currentUser?.username}/tags/${tag.id}#${$pokemonDisplayStore.id}`}>
		<Icon style="margin-top: auto; margin-bottom: auto;" name="tag" />
		<p>{tag.name}</p>
	</a>
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
