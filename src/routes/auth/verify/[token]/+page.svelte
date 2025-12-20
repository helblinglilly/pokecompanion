<script lang="ts">
	let { data } = $props();
</script>

{#if data.success}
	<p>Successfully verified your Email address</p>

	<p>You can now close this tab</p>
{:else}
	<p>Failed to verify your Email address. Please try again</p>
{/if}
