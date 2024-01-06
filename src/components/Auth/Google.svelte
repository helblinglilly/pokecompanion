<script lang="ts">
	import { setCookie } from '$lib/utils/cookies';
	import type { IAuthProvider } from '../../routes/auth/signin/+page';

	export let data: IAuthProvider;
</script>

<div class="columns">
	<div class="column centered">
		<button
			id="googleButton"
			class="button"
			on:click={async () => {
				setCookie('provider', JSON.stringify(data));
				window.location.assign(data.authUrl);
			}}
		>
			<svg
				class="svelte-fa icon svelte-1cj2gr0"
				style="height:1em;vertical-align:-.125em;transform-origin:center;overflow:visible"
				viewBox="0 0 488 512"
				aria-hidden="true"
				role="img"
				xmlns="http://www.w3.org/2000/svg"
				><g transform="translate(244 256)"
					><g transform="translate(0,0) scale(1,1)"
						><path
							d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
							fill="currentColor"
							transform="translate(-244 -256)"
						/></g
					></g
				></svg
			>
			Continue with Google</button
		>
	</div>
</div>

<style>
	#googleButton {
		display: inline-flex;
		border: #186ede;
		background: #186ede;
		color: var(--light);
	}
	#googleButton > svg {
		margin-top: auto;
		margin-bottom: auto;
		margin-right: 5px;
	}
</style>
