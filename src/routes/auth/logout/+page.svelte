<script lang="ts">
	import { DEPEND_ALL_TAGS } from '$/features/tags/depends';
	import { uuid } from '$/lib/utils/uuid';
	import { goto, invalidate } from '$app/navigation';
	import { onMount } from 'svelte';
	import { currentUser } from '$lib/stores/user';
	import { deleteCookie, setCookie } from '$lib/utils/cookies';
	import { tracker } from '$lib/analytics/tracker';

	onMount(async () => {
		tracker.logout('logout_button');
		$currentUser = null;
		deleteCookie('pb_auth');
		deleteCookie('auth-redirect');
		setCookie('remember-token', uuid());
		await invalidate(DEPEND_ALL_TAGS);
		goto('/auth/signin');
	});
</script>

<p>You have been signed out</p>
