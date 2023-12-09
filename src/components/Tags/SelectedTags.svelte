<script lang="ts">
	import type { ITagContents } from '$lib/types/ITags';
	import { onMount } from 'svelte';
	import CreateNewTag from './CreateNewTag.svelte';
	import { error, error as logError } from '$lib/log';
	import { currentUser } from '$lib/stores/user';
	import { getTagsByUser, type ITags } from '$lib/pb/tags';
	import Icon from '$components/Icon.svelte';
	import Modal from '$components/Modal.svelte';
	import { addNotification } from '$lib/stores/notifications';

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

	onMount(async () => {
		await refetchAllTags();
	});

	const refetchAllTags = async () => {
		if ($currentUser) {
			try {
				allTags = await getTagsByUser($currentUser.id);
			} catch (err) {
				logError(JSON.stringify(err), 'FailedToGetTagsByUser');
			}
		}
	};

	const addCurrentItemToTag = async (tagId: string) => {
		try {
			await fetch(`/api/tag`, {
				method: 'POST',
				body: JSON.stringify({
					id: tagId,
					contents: {
						pokemon: [{ id: currentPokemonId, added: new Date().toISOString() }]
					}
				})
			});
		} catch (err) {
			addNotification({ message: 'Could not add tag. Please try again', level: 'failure' });
			error(JSON.stringify(err), 'FailedToAddToTag');
		}
	};

	const removeCurrentItemFromTag = async (tagId: string) => {
		try {
			await fetch('/api/tag', {
				method: 'DELETE',
				body: JSON.stringify({
					id: tagId,
					contents: {
						pokemon: [{ id: currentPokemonId }]
					}
				})
			});
		} catch (err) {
			addNotification({ message: 'Could not remove tag. Please try again', level: 'failure' });
			error(JSON.stringify(err), 'FailedToRemoveToTag');
		}
	};
</script>

<div
	style="padding-top: 1rem; display: flex; justify-content: center; width: 100%; flex-flow: wrap;"
>
	{#each currentTags as tag}
		<a class="tag" href={`/user/${$currentUser?.username}/tags/${tag.id}`}>
			<Icon style="margin-top: auto; margin-bottom: auto;" name="tag" />
			<p>{tag.name}</p>
		</a>
	{/each}

	{#if allTags.length > 0}
		<button
			class="tag"
			on:click={() => {
				showAddToOverlay = true;
			}}>Edit</button
		>
	{/if}

	<button
		class="tag"
		on:click={() => {
			showAddNewOverlay = true;
		}}>New Tag</button
	>
</div>

<CreateNewTag
	bind:showAddNewOverlay
	bind:newTagInitialContent
	afterCreation={() => {
		refetchAllTags();
	}}
/>

<Modal bind:showModal={showAddToOverlay}>
	<h2 slot="header">Add and remove tags</h2>

	<div style="display: grid; gap: 1rem;">
		<p>Select the tags which this item should be attached to</p>

		<div style="display: grid;">
			{#each allTags as tag}
				<div>
					<input
						type="checkbox"
						id={tag.name}
						checked={currentTags.includes(tag)}
						on:change={async (e) => {
							if (e.currentTarget.checked) {
								await addCurrentItemToTag(tag.id);
								currentTags = currentTags.concat([tag]);
								await refetchAllTags();
							} else {
								await removeCurrentItemFromTag(tag.id);
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
				showAddToOverlay = false;
			}}>Close</button
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
