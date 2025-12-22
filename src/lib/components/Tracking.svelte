<script lang="ts">
	import { PUBLIC_ENVIRONMENT } from '$env/static/public';
</script>

<svelte:head>
	{#if PUBLIC_ENVIRONMENT === 'production'}
		<script
			defer
			src="https://analytics.helbling.uk/script.js"
			data-website-id="f303cb13-d1aa-42c0-ab5b-77937e5a1daa"
		></script>
	{/if}
</svelte:head>
