<script lang="ts">
	import { goto } from '$app/navigation';
	import { pb } from '$lib/pocketbase';
	import { currentUser } from '$lib/stores/user';
	import { onMount } from 'svelte';

	pb.authStore.clear();
	$currentUser = null;

	onMount(() => {
		goto('/auth/signin');
	});
</script>

<p>You have been signed out</p>
