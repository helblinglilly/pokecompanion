<script lang="ts">
	import type { ITagContents } from '$lib/types/ITags';
	import { onMount } from 'svelte';
	import CreateNewTag from './CreateNewTag.svelte';
	import { error as logError } from '$lib/log';
	import { currentUser } from '$lib/stores/user';
	import { getTagsByUser, type ITags } from '$lib/pb/tags';
	import Icon from '$components/Icon.svelte';
	import Modal from '$components/Modal.svelte';

	export let newTagInitialContent: ITagContents;
	let showAddNewOverlay = false;
	let showAddToOverlay = false;
	$: currentPokemonId = newTagInitialContent.pokemon[0].id;

	let allTags: ITags[] = [];
	$: currentTags = allTags.filter((tag) => {
		return tag.contents.pokemon.some((a) => {
			return a.id === currentPokemonId;
		});
	});

	let isMountedSuccessfully = false;
	onMount(async () => {
		if (!isMountedSuccessfully && $currentUser) {
			try {
				allTags = await getTagsByUser($currentUser.id);
				isMountedSuccessfully = true;
			} catch (err) {
				logError(JSON.stringify(err), '');
			}
		}
	});
</script>

<div
	style="padding-top: 1rem; display: flex; justify-content: center; width: 100%; flex-flow: wrap;"
>
	{#each currentTags as tag}
		<a class="tag" href="/user/me/list">
			<Icon style="margin-top: auto; margin-bottom: auto;" name="tag" />
			<p>{tag.name}</p>
		</a>
	{/each}

	{#if allTags.length > 0}
		<button
			class="tag"
			on:click={() => {
				showAddToOverlay = true;
			}}>+</button
		>
	{/if}

	<button
		class="tag"
		on:click={() => {
			showAddNewOverlay = true;
		}}>New Tag</button
	>
</div>

<CreateNewTag bind:showAddNewOverlay bind:newTagInitialContent />
<Modal bind:showModal={showAddToOverlay}>
	<h2 slot="header">Add Tags</h2>

	<div style="display: grid; gap: 1rem;">
		<p>Select the tags to add the current item to</p>

		<div style="display: grid;">
			{#each allTags as tag}
				<div>
					<input
						type="checkbox"
						id={tag.name}
						checked={currentTags.includes(tag)}
						on:change={(e) => {
							console.log(e.currentTarget.checked);
							if (e.currentTarget.checked) {
								currentTags = currentTags.concat([tag]);
							} else {
								currentTags = currentTags.filter((a) => a !== tag);
							}
						}}
					/>
					<label for={tag.name}>{tag.name}</label>
				</div>
			{/each}
		</div>

		<button
			class="button"
			style="width: 100%;"
			on:click={() => {
				console.log(currentTags);
			}}>Save</button
		>
	</div>
</Modal>

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
