<script lang="ts">
	import { isPasswordValid } from '$lib/utils/user';

	let newPassword: string;
	let confirmNewPassword: string;

	export let currentUser;

	const onUpdateClick = () => {
		const result = isPasswordValid(newPassword);
	};
</script>

<div style="display: grid; gap: 1rem;">
	<h3>Change password</h3>

	<input type="text" placeholder="New password" bind:value={newPassword} />

	<input type="text" placeholder="Confirm password" bind:value={confirmNewPassword} />

	<button
		class="button secondary"
		disabled={newPassword !== confirmNewPassword || !newPassword}
		on:click={() => alert('hi')}
	>
		Update
	</button>
</div>
