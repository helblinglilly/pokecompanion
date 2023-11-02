<script lang="ts">
	import Modal from '$components/Modal.svelte';

	let showModal = false;
</script>

<button class="button error" on:click={() => (showModal = true)}> Delete my account </button>

<Modal bind:showModal>
	<h2 slot="header">Confirm deletion?</h2>

	<div style="margin-top: 1rem;">
		<p>Are you sure you want to delete your user account?</p>

		<div
			style="display: inline-flex; width: 100%; justify-content: space-between; padding: 0.5rem;"
		>
			<button class="button error">Yes, delete</button>
			<button class="button">No, go back!</button>
		</div>
	</div>
</Modal>
