<script lang="ts">
	import Email from '$/routes/auth/signin/Email.svelte';
	import SocialPreview from '$/components/SocialPreview.svelte';
	import Google from './Google.svelte';
	import Github from './Github.svelte';
	import Spotify from './Spotify.svelte';
	import type { IAuthProvider } from './+page';

	export let data: { oAuthMethods: IAuthProvider[] };

	const order = ['google', 'github', 'spotify'];

	import './brands.css';
</script>

<SocialPreview
	title="Sign In"
	description={`Manage your tags to organise the world of Pokémon to your heart's content`}
/>

<h1 class="h2 text-center mb-2">Sign in</h1>

{#if data.oAuthMethods.length > 0}
	<p class="text-center mb-2">Use an existing social account</p>
	<div class="grid mobile ml-auto mr-auto gap-2 justify-center mb-4">
		{#each data.oAuthMethods.sort( (a, b) => (order.indexOf(a.name) < order.indexOf(b.name) ? -1 : 1) ) as oAuthMethod}
			{#if oAuthMethod.name === 'google'}
				<Google data={oAuthMethod} />
			{:else if oAuthMethod.name === 'github'}
				<Github data={oAuthMethod} />
			{:else if oAuthMethod.name === 'spotify'}
				<Spotify data={oAuthMethod} />
			{/if}
		{/each}
	</div>
{/if}

<p class="text-center">Or manually sign up below</p>
<div class="columns justify-center" style="flex-direction: row;">
	<div class="column mt-4" style="max-width: 400px;">
		<Email />
	</div>
</div>
