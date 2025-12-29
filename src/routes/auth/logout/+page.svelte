<script lang="ts">
	import { DEPEND_ALL_TAGS } from '$/features/tags/depends';
	import { uuid } from '$/lib/utils/uuid';
	import { goto, invalidate } from '$app/navigation';
	import { currentUser } from '$lib/stores/user';
	import { deleteCookie, setCookie } from '$lib/utils/cookies';

	$currentUser = null;
	deleteCookie('pb_auth');
	deleteCookie('auth-redirect');
	setCookie('remember-token', uuid());
	invalidate(DEPEND_ALL_TAGS);

	$effect(() => {
		goto('/auth/signin');
	});
</script>

<p>You have been signed out</p>
