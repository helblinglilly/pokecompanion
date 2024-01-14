<script lang="ts">
	import { navigating } from '$app/stores';

	let isExpanded = false;

	export let onClick: () => void = () => undefined;
	export let buttonStyles = '';
	export let buttonClasses = '';
	export let contentStyles = '';

	navigating.subscribe(() => {
		isExpanded = false;
	});
</script>

<button
	class={`button ${isExpanded ? 'isExpanded' : ''} ${buttonClasses}`}
	style={buttonStyles}
	on:click={() => {
		isExpanded = !isExpanded;
		onClick();
	}}
>
	<slot name="title" style="width: 100%;" />
</button>

{#if isExpanded}
	<div style={contentStyles}>
		<slot name="content" />
	</div>
{/if}

<style>
	button {
		display: inline-flex;
		align-content: center;
		min-width: max-content;
		margin-top: 1rem;
	}
</style>
