<script>
	import { page } from '$app/stores';
	import Feedback from '$components/Feedback.svelte';
	import Image from '$components/UI/Image.svelte';
	import { logError } from '$lib/log';

	logError('User reached error boundary', 'ErrorBoundary', {
		...$page
	});

	const errorTitle =
		$page.status === 404
			? '404 - This page could not be found'
			: $page.status < 500
			? `${$page.status} - The last request wasn't quite right`
			: `${$page.status} - Something went wrong`;
</script>

<div id="pageWrapper">
	<div id="errorHeader">
		{#if $page.status === 523}
			<Image
				src="/offline.png"
				alt="trading card game of the Chrome Offline Dinosaur"
				style="padding-top: 0; width: 80%; max-width: 450px; margin-left: auto; margin-right: auto;"
			/>

			<h2 class="h2" style="padding-top: 2rem;">You are offline</h2>
			<p>
				A page that you tried to access hasn't been cached yet, and is therefore not able to load
			</p>
			<br />
			<p>Pages that you already visited should still be available in the meantime</p>
		{:else}
			<Image src="/missingno.png" alt="missingno" style="margin-left: auto; margin-right: auto;" />

			<h2 class="h2">{errorTitle}</h2>

			<p>
				Sorry about that! The details below should give some indication as to what happened. If you
				think that this is a bug, please file an issue in the <a
					href="https://github.com/helblingjoel/pokewiki">GitHub repo</a
				>
			</p>
		{/if}
	</div>

	{#if $page.status !== 523}
		<hr />

		<div id="errorDetails">
			{#if $page.status === 400}
				{#if $page.error?.message}
					<p>{$page.error?.message}</p>
				{:else}
					<p>A client side error occurred</p>
				{/if}
			{:else if $page.status === 404}
				{#if $page.error?.message}
					<p>{$page.error?.message}</p>
				{:else}
					<p>This page does not exist.</p>
				{/if}
				<p>Go back and try to access a different page</p>
			{:else if $page.status === 500}
				<p>Your last action caused something to go wrong on the server.</p>
			{:else}
				<p>Message: {$page.error?.message}</p>
			{/if}
		</div>
	{/if}

	{#if $page.status >= 500}
		<hr />

		<h2 class="h2">Journey reporting</h2>
		<p>
			If you could spare the time to share how you got to this error screen that would be gratefully
			appreciated.
		</p>
		<Feedback placeholder={'Would you like to share how you got here?'} />
	{/if}
</div>

<style>
	#pageWrapper {
		margin: 4rem;
		margin-top: 2rem;
	}
	#errorHeader {
		display: grid;
		text-align: center;
	}
	#errorDetails {
		display: grid;
	}

	#errorDetails > p {
		text-align: center;
	}

	hr {
		margin-top: 2rem;
		margin-bottom: 2rem;
		color: var(--text);
	}

	h2 {
		text-align: center;
		margin-bottom: 2rem;
	}
</style>
