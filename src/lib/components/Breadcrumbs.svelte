<script lang="ts">
	import { Logger } from '$lib/log';

	export let breadcrumbs: { display: string; url?: string }[] = [];
</script>

<div>
	{#each breadcrumbs as { display, url }, index (url)}
		{#if url}
			<a
				href={url}
				class="underline text-textColour"
				on:click={() => {
					Logger.addPageAction('UIInteraction', 'Breadcrumbs', {
						action: 'Navigation'
					});
				}}>{display}</a
			>
		{:else}
			<p>{display}</p>
		{/if}
		{#if index < breadcrumbs.length - 1}
			<p>/</p>
		{/if}
	{/each}
</div>

<style>
	div {
		padding-bottom: 1rem;
		display: inline-flex;
		gap: 0.25rem;
		width: 100%;
	}

	a {
		min-width: fit-content;
	}
</style>
