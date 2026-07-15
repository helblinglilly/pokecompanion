<script lang="ts">
	import EmailVerification from '$/routes/user/[username]/EmailVerification.svelte';
	import DeleteUser from '$/lib/components/Users/DeleteUser.svelte';
	import { currentUser } from '$/lib/stores/user';
	import ResetPassword from './ResetPassword.svelte';
</script>

{#if $currentUser}
	<div class="columns mx-4 mb-4">
		<div class="column">
			<div class="account-option">
				<h3 class="h3">Reset password</h3>
				<ResetPassword />
			</div>

			<div class="account-option">
				<h3 class="h3">Email verification</h3>
				<EmailVerification />
			</div>

			<div class="danger-zone">
				<h2 class="h2">Danger Zone</h2>
				<div class="grid max-w-1/5">
					<DeleteUser />
				</div>
			</div>
		</div>
	</div>
{/if}

<style>
	.account-option {
		padding-top: var(--space-3);
		padding-bottom: var(--space-3);
	}

	.danger-zone {
		padding-top: 1.5rem;
	}
</style>
