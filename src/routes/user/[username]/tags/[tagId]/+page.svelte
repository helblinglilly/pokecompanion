<script lang="ts">
	import Breadcrumbs from '$/lib/components/Breadcrumbs.svelte';
	import { currentUser } from '$lib/stores/user';
	import SocialPreview from '$/lib/components/SocialPreview.svelte';
	import TagEditor from './TagEditor.svelte';
	import TagPokemon from './TagPokemon.svelte';
	import TagMove from './TagMove.svelte';
	import TagViewOptions from './TagViewOptions.svelte';
	import Header from './Header.svelte';
	import { get } from 'svelte/store';
	import { PUBLIC_API_HOST } from '$env/static/public';

	let { data } = $props();

	let filterTerm = $state('');
	let numberOfItems = $derived(
		(data.tag.contents.move?.length ?? 0) + (data.tag.contents.pokemon?.length ?? 0)
	);

	let inModifyView = $state(false);

	$effect(() => {
		const user = get(currentUser);
		if (!user) return;

		const controller = new AbortController();

		fetch(`${PUBLIC_API_HOST}/lastAction`, {
			method: 'PATCH',
			signal: controller.signal,
			headers: {
				'Content-Type': 'application/json'
			},
			credentials: 'include',
			body: JSON.stringify({
				tag: {
					tagId: data.tag.id,
					userId: data.tag.owner
				}
			})
		}).catch((err) => {
			if (err.name !== 'AbortError') console.error(err);
		});

		// Cleanup: abort if user navigates away or effect re-runs
		return () => controller.abort();
	});
</script>

<SocialPreview
	title={`"${data.tag.name}" tag`}
	description={`${data.user.username} created this tag with ${
		data.tag.contents.pokemon ? data.tag.contents.pokemon.length : 0
	} Pokémon`}
/>

<Breadcrumbs
	breadcrumbs={[
		{
			display: data.user.username,
			url: `/user/${data.user.username}`
		},
		{
			display: data.tag.name
		}
	]}
/>

<div class="grid gap-4 pb-4 text-center md:text-left">
	<Header entry={data.tag} bind:inModifyView />

	<div class="w-full justify-center md:w-fit grid md:inline-flex gap-2 items-center">
		{#if $currentUser?.username === data.user.username && inModifyView}
			<TagEditor tag={data.tag} />
		{:else if !inModifyView}
			<TagViewOptions />
		{/if}
	</div>
</div>

<div class="grid gap-4">
	{#await data.tagPokemon}
		<p>Loading Pokemon...</p>
	{:then tagPokemon}
		<TagPokemon {filterTerm} {inModifyView} allPokemon={tagPokemon} tag={data.tag} />
	{/await}

	{#await data.tagMoves}
		<p>Loading Moves...</p>
	{:then tagMoves}
		<TagMove {inModifyView} moveCollection={tagMoves.moves} tag={data.tag} />
	{:catch}
		<p>Failed to get moves</p>
	{/await}
</div>

<div class="w-full text-center mt-12">
	<i>{numberOfItems} entries</i>

	{#if $currentUser?.username === data.user.username}
		<p>Created: {new Date(data.tag.created).toLocaleString()}</p>
		<p>Updated: {new Date(data.tag.updated).toLocaleString()}</p>
	{/if}
</div>
