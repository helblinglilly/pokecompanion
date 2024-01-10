<script lang="ts">
	let isExpanded = false;

	export let onClick: () => void = () => undefined;
	export let buttonStyles = '';
	export let buttonClasses = '';
	export let contentStyles = '';
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

	/* button.isExpanded {
		background-color: var(--selected);
	}
	button.isExpanded:hover {
		background-color: var(--selected);
	} */
</style>
