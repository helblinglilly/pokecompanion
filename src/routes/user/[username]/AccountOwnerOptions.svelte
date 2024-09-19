<script lang="ts">
	import EmailVerification from '$/routes/user/[username]/EmailVerification.svelte';
	import DeleteUser from '$/lib/components/Users/DeleteUser.svelte';
	import { currentUser } from '$/lib/stores/user';
	import ResetPassword from './ResetPassword.svelte';
</script>

{#if $currentUser}
	<div class="columns mx-4 mb-4">
		<div class="column">
			<div style="padding-top: 1rem; padding-bottom: 1rem;">
				<h3 class="h3">Reset password</h3>
				<ResetPassword />
			</div>

			<div style="padding-top: 1rem; padding-bottom: 1rem;">
				<h3 class="h3">Email verification</h3>
				<EmailVerification />
			</div>

			<div style="padding-top: 1.5rem;">
				<h2 class="h2">Danger Zone</h2>
				<DeleteUser user={$currentUser} />
			</div>
		</div>
	</div>
{/if}
