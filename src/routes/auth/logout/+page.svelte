<script lang="ts">
	import { goto } from '$app/navigation';
	import { pb } from '$lib/stores/domain';
	import { currentUser } from '$lib/stores/user';
	import { deleteCookie } from '$lib/utils/cookies';
	import { onMount } from 'svelte';

	$pb.authStore.clear();
	$currentUser = null;
	deleteCookie('pb_auth');
	deleteCookie('auth-redirect');

	onMount(() => {
		goto('/auth/signin');
	});
</script>

<p>You have been signed out</p>
