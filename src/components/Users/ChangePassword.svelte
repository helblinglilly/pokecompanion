<script lang="ts">
	import { isPasswordValid } from '$lib/utils/user-client';

	let newPassword: string;
	let confirmNewPassword: string;

	const onUpdateClick = () => {
		const result = isPasswordValid(newPassword);
	};
</script>

<div style="display: grid; gap: 1rem; max-width: 400px;">
	<h3>Change password</h3>

	<input type="password" placeholder="New password" bind:value={newPassword} />

	<input type="password" placeholder="Confirm password" bind:value={confirmNewPassword} />

	<button
		class="button secondary"
		disabled={newPassword !== confirmNewPassword || !newPassword}
		on:click={() => alert('hi')}
	>
		Update
	</button>
</div>
