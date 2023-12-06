<script lang="ts">
	import Breadcrumbs from '$components/Breadcrumbs.svelte';
	import InlineTextButton from '$components/InlineTextButton.svelte';
	import Modal from '$components/Modal.svelte';
	import PokemonTag from '$components/Tags/PokemonTag.svelte';
	import { currentUser } from '$lib/stores/user';

	export let data;

	let newName = data.tag.name;
	let showRenameOverlay = false;

	$: tags = data;
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

<h1>{tags.tag.name}</h1>

<div class="columns">
	<div class="column" id="pokemonList">
		<h2>Pokémon</h2>
		{#if tags.tag.contents.pokemon.length > 0}
			<table style="width: 100%;">
				{#each tags.tag.contents.pokemon as pokemonTag}
					<PokemonTag
						id={pokemonTag.id}
						added={new Date(pokemonTag.added)}
						onRemoveClick={async () => {
							try {
								await fetch('/api/tag', {
									method: 'DELETE',
									body: JSON.stringify({
										id: data.tag.id,
										contents: {
											pokemon: [{ id: pokemonTag.id }]
										}
									})
								});

								tags.tag.contents.pokemon = tags.tag.contents.pokemon.filter((a) => {
									return a.id !== pokemonTag.id;
								});
							} catch (err) {
								console.log(err);
								// Set notification that it failed
							}
						}}
					/>
				{/each}
			</table>
		{:else}
			<p>No Pokémon in this list</p>
		{/if}
	</div>
</div>

{#if $currentUser}
	<section>
		<div>
			<button class="button" on:click={() => (showRenameOverlay = true)}>Rename</button>
			<button class="button">Make {data.tag.isPrivate ? 'Public' : 'Private'}</button>
		</div>
		<div style="padding-top: 1rem;">
			<button class="button error">Delete Tag</button>
		</div>
	</section>
{/if}

<Modal bind:showModal={showRenameOverlay}>
	<h2 slot="header">Rename Tag</h2>

	<InlineTextButton
		buttonConfig={{ text: 'Rename' }}
		variation="small"
		containerStyling="padding: 1rem;"
		inputConfig={{ placeholder: 'New name' }}
		valueBinding={newName}
	/>
</Modal>

<style>
	@media screen and (min-width: 768px) {
		#pokemonList {
			max-width: 50%;
		}
	}
</style>
