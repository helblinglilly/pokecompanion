<script>
	import { page } from '$app/stores';
</script>

<div id="pageWrapper">
	<div id="errorHeader">
		<img src="/missingno.png" alt="missingno" />

		<h1>Something went wrong!</h1>

		<p>
			Sorry about that! The details below should give some indication as to what happened. If you
			think that this is a bug, please file an issue in the <a
				href="https://github.com/helblingjoel/pokewiki">GitHub repo</a
			>
		</p>
	</div>

	<hr />

	<div id="errorDetails">
		<h2>Status: {$page.status}</h2>

		{#if $page.status === 404}
			<p>This page does not exist.</p>
			<p>Go back and try to access a different page</p>
		{:else if $page.status === 500}
			<p>Your last action caused something to go wrong on the server.</p>
			<p>ID: {$page.error?.errorId}</p>
		{:else}
			<p>Message: {$page.error?.message}</p>
		{/if}
	</div>
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

	img {
		padding-top: 2rem;
		margin-left: auto;
		margin-right: auto;
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
