<script lang="ts">
	import Breadcrumbs from '$components/Breadcrumbs.svelte';
	import Icon from '$components/Icon.svelte';
	import InlineTextButton from '$components/InlineTextButton.svelte';
	import Modal from '$components/Modal.svelte';
	import PokemonPreview from '$components/Pokemon/PokemonPreview.svelte';
	import PokemonTag from '$components/Tags/PokemonTag.svelte';
	import { error } from '$lib/log.js';
	import { addNotification } from '$lib/stores/notifications.js';
	import { currentUser } from '$lib/stores/user';

	export let data;
	$: tags = data;

	let hasChanges = false;

	let showRenameOverlay = false;
	let inModifyView = false;

	const saveUpdatedTag = async () => {
		if (hasChanges) {
			try {
				const response = await fetch('/api/tag', {
					method: 'PATCH',
					body: JSON.stringify({
						id: tags.tag.id,
						name: tags.tag.name,
						contents: tags.tag.contents,
						isPrivate: tags.tag.isPrivate
					})
				});
				if (response.status !== 200) {
					throw new Error(`Non-200 status code ${response.status}`);
				}

				const newBody = await response.json();
				tags.tag = newBody;
			} catch (err) {
				addNotification({ message: 'Failed to save tag', level: 'failure' });
				error(JSON.stringify(err), 'FailedToSaveTag');
			}
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
	<h1 style="padding: 0;">{tags.tag.name}</h1>
	{#if tags.tag.isPrivate}
		<Icon name="lock" style="margin-top: auto; margin-bottom: auto;" />
	{/if}
</div>

{#if $currentUser?.username === tags.user.username}
	<div>
		<button
			class="button"
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
			}}>{inModifyView ? 'Save' : 'Modify'}</button
		>
		{#if inModifyView}
			<button class="button" on:click={() => (showRenameOverlay = true)}>Rename</button>
			<button
				class="button"
				on:click={() => {
					tags.tag.isPrivate = !tags.tag.isPrivate;
					hasChanges = true;
				}}>Make {tags.tag.isPrivate ? 'Public' : 'Private'}</button
			>
			<button
				class="button error"
				on:click={() => {
					addNotification({ message: 'To do', level: 'info' });
				}}>Delete Tag</button
			>
		{/if}
	</div>
{/if}

<div class="columns" style="padding: 0;">
	<div class="column" id="pokemonList" style="padding: 0;">
		{#if tags.tag.contents.pokemon.length > 0}
			<table style="width: 100%;">
				{#each tags.tag.contents.pokemon as pokemonTag}
					{#if $currentUser?.username === tags.user.username && inModifyView}
						<PokemonTag
							id={pokemonTag.id}
							added={new Date(pokemonTag.added)}
							onRemoveClick={async () => {
								tags.tag.contents.pokemon = tags.tag.contents.pokemon.filter((a) => {
									return a.id !== pokemonTag.id;
								});
								hasChanges = true;
							}}
						/>
					{:else}
						<PokemonPreview pokemon={{ id: pokemonTag.id }} />
					{/if}
				{/each}
			</table>
		{:else}
			<p>No Pokémon in this list</p>
		{/if}
	</div>
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

<style>
	@media screen and (min-width: 768px) {
		#pokemonList {
			max-width: 50%;
		}
	}
</style>
