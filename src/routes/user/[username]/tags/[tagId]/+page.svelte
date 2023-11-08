<script lang="ts">
	import InlineTextButton from '$components/InlineTextButton.svelte';
	import Modal from '$components/Modal.svelte';
	import { currentUser } from '$lib/stores/user';

	export let data;

	let newName = data.tag.name;
	let showRenameOverlay = false;
</script>

<h2>{data.tag.name}</h2>

<h3>Pokémon</h3>
{#each data.tag.contents.pokemon as pokemonTag}
	<p>{pokemonTag.id}</p>
{/each}

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
		inputConfig={{ valueBind: newName, placeholder: 'New name' }}
	/>
</Modal>
