<script lang="ts">
	import Email from '$components/Auth/Email.svelte';
	import Github from '$components/Auth/Github.svelte';
	import Google from '$components/Auth/Google.svelte';
	import Spotify from '$components/Auth/Spotify.svelte';
	import type { IAuthProvider } from './+page';

	export let data: { oAuthMethods: IAuthProvider[] };
</script>

<svelte:head>
	<title>Sign in - Pokecompanion</title>
</svelte:head>

{#each data.oAuthMethods.sort((a, b) => (a.name < b.name ? -1 : 1)) as oAuthMethod}
	{#if oAuthMethod.name === 'google'}
		<div class="columns">
			<div class="column centered">
				<Google data={oAuthMethod} />
			</div>
		</div>
	{:else if oAuthMethod.name === 'github'}
		<div class="columns">
			<div class="column centered">
				<Github data={oAuthMethod} />
			</div>
		</div>
	{:else if oAuthMethod.name === 'spotify'}
		<div class="columns">
			<div class="column centered">
				<Spotify data={oAuthMethod} />
			</div>
		</div>
	{/if}
{/each}

<div class="columns">
	<div class="column centered">
		<Email />
	</div>
</div>
