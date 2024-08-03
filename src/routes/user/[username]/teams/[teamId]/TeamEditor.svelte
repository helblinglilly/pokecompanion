<script lang="ts">
	import { addNotification } from '$/lib/stores/notifications';
	import { currentUser } from '$/lib/stores/user';
	import type { ITeam } from '$/lib/types/ITeams';
	import Button from '$/ui/atoms/button';
	import Modal from '$/ui/molecules/Modal/Modal.svelte';
	import { goto } from '$app/navigation';
	import type { Writable } from 'svelte/store';

	export let team: Writable<ITeam>;

	let showDescriptionOverlay = false;
	let showDeleteOverlay = false;

	let newDescription = $team.description;
</script>

<Button
	variant="primary"
	on:click={() => {
		showDescriptionOverlay = true;
	}}
>
	Edit Description
</Button>

<Button
	variant="primary"
	on:click={async () => {
		const res = await fetch(`/api/teams/${$team.id}`, {
			method: 'PATCH',
			body: JSON.stringify({
				id: $team.id,
				isPrivate: !$team.isPrivate
			})
		});

		if (!res.ok) {
			addNotification({
				level: 'failure',
				message: 'Failed to update team visibility. Please try again.'
			});
		} else {
			$team.isPrivate = !$team.isPrivate;
		}
	}}
>
	Make {$team.isPrivate ? 'Public' : 'Private'}
</Button>

<Button
	classes="error"
	on:click={async () => {
		showDeleteOverlay = true;
	}}>Delete Team</Button
>

<Modal bind:showModal={showDescriptionOverlay} classes="md:w-[30rem]">
	<h2 class="h2" slot="header">Edit Description</h2>

	<div class="grid gap-4 md:px-8 md:pt-8">
		<textarea placeholder={$team.description} bind:value={newDescription} />

		<Button
			on:click={async () => {
				if (!newDescription) {
					return;
				}
				showDescriptionOverlay = false;

				const res = await fetch(`/api/teams/${$team.id}`, {
					method: 'PATCH',
					body: JSON.stringify({
						description: newDescription
					})
				});

				if (!res.ok) {
					addNotification({
						level: 'failure',
						message: 'Failed to update description. Please try again'
					});
				} else {
					$team.description = newDescription;
				}
				showDeleteOverlay = false;
			}}>Save</Button
		>
	</div>
</Modal>

<Modal bind:showModal={showDeleteOverlay} classes="md:w-[30rem]">
	<h2 class="h2" slot="header">Delete {$team.name}</h2>

	<div class="mt-4 grid gap-4 text-center">
		<p>Are you sure you want to to delete "{$team.name}"?</p>

		<div
			style="display: inline-flex; width: 100%; justify-content: space-between; padding: 0.5rem;"
		>
			<Button
				classes="error"
				on:click={async () => {
					const res = await fetch(`/api/teams/${$team.id}`, {
						method: 'DELETE'
					});

					if (res.ok) {
						goto(`/user/${$currentUser?.username}`);
					} else {
						addNotification({
							level: 'failure',
							message: 'Failed to delete team. Please try again'
						});
					}
				}}>Yes, delete</Button
			>
			<Button on:click={() => (showDeleteOverlay = false)}>No, go back!</Button>
		</div>
	</div>
</Modal>
