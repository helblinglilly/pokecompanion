<script lang="ts">
	import type { paths } from '$/@types/api';
	import Image from '$/ui/atoms/Image.svelte';
	import { setCookie } from '$lib/utils/cookies';

	interface Props {
		data: paths['/auth/methods']['get']['responses']['200']['content']['application/json']['oAuth'][number];
	}

	let { data }: Props = $props();
</script>

<button
	class="spotify-btn signin-button"
	onclick={async () => {
		setCookie('provider', JSON.stringify(data));
		window.location.assign(data.authUrl);
	}}
>
	<Image
		src="/icons/spotify.png"
		style="margin-right: 15px; background-color: #000; border-radius: 20px;"
		height="20px"
		width="20px"
		alt="Spotify"
		loading="eager"
	/>
	Sign in with Spotify</button
>

<style>
	.spotify-btn {
		display: inline-flex;
		align-items: center;
		background-color: #191414;
		color: white;
		border: none;
		padding: 10px 20px;
		border-radius: 5px;
		cursor: pointer;
		text-decoration: none;
		transition: background-color 0.3s ease;
		height: 38px;
		width: 220px;
	}
</style>
