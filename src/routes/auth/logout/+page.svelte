<script lang="ts">
	import { uuid } from '$/lib/utils/uuid';
	import { goto } from '$app/navigation';
	import { currentUser } from '$lib/stores/user';
	import { deleteCookie, setCookie } from '$lib/utils/cookies';
	import { onMount } from 'svelte';

	$currentUser = null;
	deleteCookie('pb_auth');
	deleteCookie('auth-redirect');
	setCookie('remember-token', uuid());

	onMount(() => {
		goto('/auth/signin');
	});
</script>

<p>You have been signed out</p>
