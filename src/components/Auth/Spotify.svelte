<script lang="ts">
	import { goto } from '$app/navigation';
	import Image from '$/components/UI/Image.svelte';
	import { setCookie } from '$lib/utils/cookies';
	import type { IAuthProvider } from '../../routes/auth/signin/+page';

	export let data: IAuthProvider;
</script>

<div class="columns">
	<div class="column centered">
		<button
			id="spotifyButton"
			class="button"
			on:click={async () => {
				setCookie('provider', JSON.stringify(data));
				goto(data.authUrl);
			}}
		>
			<Image
				src="/icons/spotify.png"
				style="margin-right: 4px;"
				height="24px"
				width="24px"
				alt="Spotify"
				loading="eager"
			/>
			Continue with Spotify</button
		>
	</div>
</div>

<style>
	#spotifyButton {
		background: #191414;
		color: var(--light);
		display: inline-flex;
	}
</style>
