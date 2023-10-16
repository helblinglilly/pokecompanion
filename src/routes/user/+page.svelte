<script lang="ts">
	import { page } from '$app/stores';
	import SigninGuard from '$components/Auth/SigninGuard.svelte';
	import { pb } from '$lib/pocketbase';
	import { currentUser } from '$lib/stores/user';
</script>

<SigninGuard>
	<p>{JSON.stringify($page.data.session)}</p>
	<div class="columns">
		<div class="column">
			<p>{JSON.stringify($currentUser)}</p>
		</div>
	</div>
	<button
		on:click={() => {
			pb.authStore.clear();
			$currentUser = null;
		}}
		class="button">Sign out</button
	>
</SigninGuard>
