<script lang="ts">
	import { goto } from '$app/navigation';
	import { pb } from '$lib/stores/domain';
	import { currentUser } from '$lib/stores/user';
	import { deleteCookie, setCookie } from '$lib/utils/cookies';
	import { onMount } from 'svelte';
	import { v4 as uuid } from 'uuid';

	$pb.authStore.clear();
	$currentUser = null;
	deleteCookie('pb_auth');
	deleteCookie('auth-redirect');
	setCookie('remember-token', uuid());

	onMount(() => {
		goto('/auth/signin');
	});
</script>

<p>You have been signed out</p>
