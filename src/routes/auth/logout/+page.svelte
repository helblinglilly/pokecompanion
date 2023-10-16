<script lang="ts">
	import { goto } from '$app/navigation';
	import { pb } from '$lib/pocketbase';
	import { currentUser } from '$lib/stores/user';

	pb.authStore.clear();
	$currentUser = null;
</script>

<p>You have been signed out</p>
