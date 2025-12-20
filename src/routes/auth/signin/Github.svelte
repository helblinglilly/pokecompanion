<script lang="ts">
	import type { paths } from '$/@types/api';
	import { setCookie } from '$lib/utils/cookies';

	interface Props {
		data: paths['/auth/methods']['get']['responses']['200']['content']['application/json']['oAuth'][number];
	}

	let { data }: Props = $props();
</script>

<button
	class="github signin-button"
	onclick={async () => {
		setCookie('provider', JSON.stringify(data));
		window.location.assign(data.authUrl);
	}}
>
	<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" width="20" height="20">
		<path
			d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82a7.4 7.4 0 0 1 2.01-.27c.68 0 1.36.09 2.01.27 1.52-1.03 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.01 8.01 0 0 0 16 8c0-4.42-3.58-8-8-8z"
		/>
	</svg>
	Sign in with GitHub
</button>

<style>
	.github {
		display: inline-flex;
		align-items: center;
		background-color: var(--github-bg);
		color: white;
		border: none;
		padding: 10px 20px;
		border-radius: 5px;
		cursor: pointer;
		text-decoration: none;
		transition: background-color 0.3s ease;
		width: 220px;
	}

	.github svg {
		margin-right: 15px;
		fill: white;
		justify-content: center;
	}
</style>
