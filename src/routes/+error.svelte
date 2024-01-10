<script>
	import { page } from '$app/stores';
	import Image from '$components/UI/Image.svelte';
	import { error } from '$lib/log';

	error(
		$page.error?.message ?? 'User reached error page',
		$page.error?.errorId ?? 'Unknown',
		($page.error?.status ?? $page.status).toString()
	);
</script>

<div id="pageWrapper">
	<div id="errorHeader">
		{#if $page.error?.status === 523}
			<Image
				src="/offline.png"
				alt="trading card game of the Chrome Offline Dinosaur"
				style="padding-top: 0; width: 80%; max-width: 450px; margin-left: auto; margin-right: auto;"
			/>

			<h2 style="padding-top: 2rem;">You are offline</h2>
			<p>
				A page that you tried to access hasn't been cached yet, and is therefore not able to load
			</p>
			<br />
			<p>Pages that you already visited should still be available in the meantime</p>
		{:else}
			<Image src="/missingno.png" alt="missingno" style="margin-left: auto; margin-right: auto;" />

			<h1>Something went wrong!</h1>

			<p>
				Sorry about that! The details below should give some indication as to what happened. If you
				think that this is a bug, please file an issue in the <a
					href="https://github.com/helblingjoel/pokewiki">GitHub repo</a
				>
			</p>
		{/if}
	</div>

	{#if $page.error?.status !== 523}
		<hr />

		<div id="errorDetails">
			<h2>Status: {$page.error?.status ?? $page.status}</h2>

			{#if $page.status === 400 || $page.error?.status === 400}
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
				<p>ID: {$page.error?.errorId}</p>
			{:else}
				<p>Message: {$page.error?.message}</p>
			{/if}
		</div>
	{/if}
</div>

<style>
	#pageWrapper {
		margin: 4rem;
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

	h1 {
		padding-top: 1rem;
		text-align: center;
		padding-bottom: 1rem;
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
