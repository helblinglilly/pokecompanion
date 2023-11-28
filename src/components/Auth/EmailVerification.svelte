<script>
	import { pb } from '$lib/stores/domain';
	import { currentUser } from '$lib/stores/user';
</script>

{#if !$currentUser}
	<p>Not signed in</p>
{:else if !$currentUser.verified}
	<p>{$currentUser.email} is not verified</p>
	<button
		class="button secondary"
		on:click={async () => {
			try {
				if (!$currentUser) {
					return;
				}
				await $pb.collection('users').requestVerification($currentUser.email);
			} catch (err) {
				console.error('Failed to request verification Email');
				// set notification
			}
		}}>Request verification email</button
	>
{:else}
	<p>{$currentUser.email} is verified</p>
{/if}
