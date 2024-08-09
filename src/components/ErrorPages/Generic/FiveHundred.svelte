<script>
	import { page } from '$app/stores';
	import Feedback from '$/components/Feedback.svelte';
	import Image from '$/ui/atoms/image/Image.svelte';
	import { Logger } from '$lib/log';
	import { onMount } from 'svelte';

	onMount(async () => {
		await Logger.addPageAction('ErrorBoundary', 'FiveHundred', {
			error: $page.error?.message
		});
	});
</script>

<Image src="/missingno.png" alt="missingno" style="margin-left: auto; margin-right: auto;" />

<h2 class="h2">{$page.status} - Something went wrong</h2>

<p>{$page.error?.message}</p>

<div style="margin-top: 1rem;">
	<p>
		Sorry about that! The details above might give some indication as to what happened. If you think
		that this is a bug, please file an issue in the <a
			href="https://github.com/helblinglilly/pokecompanion">GitHub repo</a
		>
	</p>
</div>
<hr />

<div id="userFeedbackWrapper">
	<h2 class="h2" style="margin-bottom: 1rem;">Feedback</h2>
	<Feedback placeholder="Would you like to share how you got here?" />
</div>

<style>
	hr {
		margin-top: 2rem;
		margin-bottom: 2rem;
		color: var(--text);
	}
</style>
