<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Breadcrumbs from '$components/Breadcrumbs.svelte';
	import Icon from '$components/Icon.svelte';
	import InlineTextButton from '$components/InlineTextButton.svelte';
	import Modal from '$components/Modal.svelte';
	import PokemonCardEntry from '$components/Tags/PokemonCardEntry.svelte';
	import PokemonListEntry from '$components/Tags/PokemonListEntry.svelte';
	import { error } from '$lib/log';
	import { addNotification } from '$lib/stores/notifications';
	import { currentUser } from '$lib/stores/user';
	import type { ITagPokemon } from '$lib/types/ITags.js';
	import { onMount } from 'svelte';

	export let data;
	$: tags = data;

	let hasChanges = false;

	let showRenameOverlay = false;
	let showDeleteOverlay = false;
	let inModifyView = false;

	let displayMode: string = $page.url.searchParams.get('view') ?? 'list';

	let isMounted = false;
	onMount(() => {
		isMounted = true;
	});

	$: {
		if (displayMode && isMounted) {
			const newUrl = new URL($page.url);
			newUrl.searchParams.set('view', displayMode);
			goto(newUrl.toString(), { replaceState: true });
		}
	}

	const saveUpdatedTag = async () => {
		if (hasChanges) {
			try {
				const response = await fetch('/api/tag', {
					method: 'PATCH',
					body: JSON.stringify({
						id: tags.tag.id,
						name: tags.tag.name,
						contents: tags.tag.contents,
						isPrivate: tags.tag.isPrivate,
						showGenderAndShiny: tags.tag.showGenderAndShiny ?? false
					})
				});
				if (response.status !== 200) {
					throw new Error(`Non-200 status code ${response.status}`);
				}

				const newBody = await response.json();
				tags.tag = newBody;
			} catch (err) {
				addNotification({ message: 'Failed to save tag', level: 'failure' });
				error(
					'Failed to save tag',
					'FailedToSaveTag',
					`Tag ID: ${data.tag.id}, Name: ${tags.tag.name}, Contents: ${
						tags.tag.contents
					}, Error: ${JSON.stringify(err)}`
				);
			}
		}
	};

	const removeFromTag = (pokemon: ITagPokemon) => {
		tags.tag.contents.pokemon = tags.tag.contents.pokemon.filter((tagMon) => {
			return !(JSON.stringify(tagMon) === JSON.stringify(pokemon));
		});
		hasChanges = true;
	};

	const deleteTag = async () => {
		try {
			await fetch('/api/tags', {
				method: 'DELETE',
				body: JSON.stringify({
					id: tags.tag.id
				})
			});
			addNotification({ message: `Deleted "${tags.tag.name}"`, level: 'success' });
			goto(`/user/${$currentUser?.username}`);
		} catch (err) {
			error(
				'Failed to delete Tag',
				'FailedToDeleteTag',
				`User: ${$currentUser?.username}, ID: ${tags.tag.id}, Error: ${err}`
			);
			addNotification({
				message: `Failure to delete tag "${tags.tag.name}""`,
				level: 'failure'
			});
		}
	};
</script>

<svelte:head>
	<title>{tags.tag.name} - Pokécompanion</title>
</svelte:head>

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

<div style="display: inline-flex; padding-bottom: 1rem; gap: 0.5rem; width: 100%;">
	{#if $currentUser?.username === tags.user.username}
		<button
			class="button"
			style="max-height: 3rem;"
			on:click={async () => {
				if (inModifyView) {
					try {
						await saveUpdatedTag();
					} catch (_) {
						addNotification({ message: 'Failed to save changes', level: 'failure' });
						return;
					}
				}
				inModifyView = !inModifyView;
			}}
		>
			<Icon name={`${inModifyView ? 'floppy' : 'pencil'}`} style="" />
		</button>
	{/if}

	<h1 style="padding: 0;">{tags.tag.name}</h1>
	{#if tags.tag.isPrivate}
		<Icon name="lock" style="margin-top: auto; margin-bottom: auto;" />
	{/if}
</div>

{#if inModifyView}
	<div>
		<button style="margin-bottom: 1rem;" class="button" on:click={() => (showRenameOverlay = true)}
			>Rename</button
		>
		<button
			style="margin-bottom: 1rem;"
			class="button"
			on:click={() => {
				tags.tag.showGenderAndShiny = !tags.tag.showGenderAndShiny;
				hasChanges = true;
			}}>{`${tags.tag.showGenderAndShiny ? 'Hide' : 'Show'}`} Variety indicators</button
		>
		<button
			class="button"
			style="margin-bottom: 1rem;"
			on:click={() => {
				tags.tag.isPrivate = !tags.tag.isPrivate;
				hasChanges = true;
			}}>Make {tags.tag.isPrivate ? 'Public' : 'Private'}</button
		>
		<button
			class="button error"
			style="margin-bottom: 1rem;"
			on:click={() => {
				showDeleteOverlay = true;
			}}>Delete Tag</button
		>
	</div>
{/if}

<div style="display: inline-flex; gap: 0.5rem; align-items: center;">
	<p>View:</p>
	<button
		class={`button ${displayMode === 'list' ? 'selected' : ''}`}
		on:click={() => {
			displayMode = 'list';
		}}><Icon name="list" style="" /></button
	>
	<button
		class={`button ${displayMode === 'card' ? 'selected' : ''}`}
		on:click={() => {
			displayMode = 'card';
		}}><Icon name="card" style="" /></button
	>
</div>

<div id="pokemonTagWrapper">
	{#if tags.tag.contents.pokemon.length === 0}
		<p>No Pokémon in this list</p>
	{/if}

	{#each tags.tag.contents.pokemon.sort((a, b) => (a.id > b.id ? 1 : -1)) as pokemonTag}
		{#if displayMode === 'card'}
			<PokemonCardEntry
				pokemon={pokemonTag}
				showRemoveButton={inModifyView}
				showGenderAndShiny={tags.tag.showGenderAndShiny}
				onRemoveClick={() => {
					removeFromTag(pokemonTag);
				}}
			/>
		{:else}
			<PokemonListEntry
				pokemon={pokemonTag}
				showRemoveButton={inModifyView}
				showGenderAndShiny={tags.tag.showGenderAndShiny}
				onRemoveClick={() => {
					removeFromTag(pokemonTag);
				}}
			/>
		{/if}
	{/each}
</div>

<div style="display: grid; justify-content: center;">
	<p style="min-width: fit-content;">{tags.tag.contents.pokemon.length} Pokémon</p>
</div>

<Modal bind:showModal={showRenameOverlay}>
	<h2 slot="header">Rename Tag</h2>

	<InlineTextButton
		buttonConfig={{
			text: 'Rename',
			onClick: (newVal) => {
				if (newVal && tags.tag.name !== newVal) {
					tags.tag.name = newVal;
					hasChanges = true;
				}
				showRenameOverlay = false;
			}
		}}
		variation="small"
		containerStyling="padding: 1rem;"
		inputConfig={{ placeholder: 'New name' }}
		valueBinding={tags.tag.name}
	/>
</Modal>

<Modal bind:showModal={showDeleteOverlay}>
	<h2 slot="header">Delete Tag</h2>

	<div style="padding-top: 1rem;">
		<p>Are you sure you want to delete this tag and all of its contents?</p>
	</div>

	<div style="display: flex; justify-content: space-between; padding-top: 1rem;">
		<button
			class="button error"
			on:click={async () => {
				showDeleteOverlay = false;
				await deleteTag();
			}}
		>
			Yes, delete
		</button>

		<button
			class="button"
			on:click={() => {
				showDeleteOverlay = false;
			}}
		>
			No, cancel
		</button>
	</div>
</Modal>

<style>
	#pokemonTagWrapper {
		display: flex;
		flex-wrap: wrap;
		padding: 0;
		justify-content: space-around;
	}
</style>
