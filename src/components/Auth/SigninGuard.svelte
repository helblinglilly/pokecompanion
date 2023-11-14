<script lang="ts">
	import { goto } from '$app/navigation';
	import { currentUser } from '$lib/stores/user';
	import { onMount } from 'svelte';

	let isMounted = false;

	onMount(() => {
		isMounted = true;
	});

	$: if (!$currentUser && isMounted) {
		goto('/auth/signin');
	}
</script>

{#if $currentUser}
	<slot />
{:else}
	<p>Not Authenticated</p>
{/if}
