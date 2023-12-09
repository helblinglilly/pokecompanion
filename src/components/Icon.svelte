<script lang="ts">
	export let name: 'tag' | 'tags' | 'lock' | 'mars' | 'venus' | 'spark' | 'spark-full';
	export let theme: 'dark' | 'light' | null = null;
	export let style: string | null;
</script>

{#if name === 'tag'}
	<svg {style} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"
		><path
			d="M0 80V229.5c0 17 6.7 33.3 18.7 45.3l176 176c25 25 65.5 25 90.5 0L418.7 317.3c25-25 25-65.5 0-90.5l-176-176c-12-12-28.3-18.7-45.3-18.7H48C21.5 32 0 53.5 0 80zm112 32a32 32 0 1 1 0 64 32 32 0 1 1 0-64z"
		/></svg
	>
{:else if name === 'tags'}
	<svg {style} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 512 512"
		><path
			d="M345 39.1L472.8 168.4c52.4 53 52.4 138.2 0 191.2L360.8 472.9c-9.3 9.4-24.5 9.5-33.9 .2s-9.5-24.5-.2-33.9L438.6 325.9c33.9-34.3 33.9-89.4 0-123.7L310.9 72.9c-9.3-9.4-9.2-24.6 .2-33.9s24.6-9.2 33.9 .2zM0 229.5V80C0 53.5 21.5 32 48 32H197.5c17 0 33.3 6.7 45.3 18.7l168 168c25 25 25 65.5 0 90.5L277.3 442.7c-25 25-65.5 25-90.5 0l-168-168C6.7 262.7 0 246.5 0 229.5zM144 144a32 32 0 1 0 -64 0 32 32 0 1 0 64 0z"
		/></svg
	>
{:else if name === 'lock'}
	<svg {style} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"
		><!--! Font Awesome Free 6.4.2 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license (Commercial License) Copyright 2023 Fonticons, Inc. --><path
			d="M144 144v48H304V144c0-44.2-35.8-80-80-80s-80 35.8-80 80zM80 192V144C80 64.5 144.5 0 224 0s144 64.5 144 144v48h16c35.3 0 64 28.7 64 64V448c0 35.3-28.7 64-64 64H64c-35.3 0-64-28.7-64-64V256c0-35.3 28.7-64 64-64H80z"
		/></svg
	>
{:else if name === 'mars'}
	<svg {style} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"
		><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path
			d="M289.8 46.8c3.7-9 12.5-14.8 22.2-14.8H424c13.3 0 24 10.7 24 24V168c0 9.7-5.8 18.5-14.8 22.2s-19.3 1.7-26.2-5.2l-33.4-33.4L321 204.2c19.5 28.4 31 62.7 31 99.8c0 97.2-78.8 176-176 176S0 401.2 0 304s78.8-176 176-176c37 0 71.4 11.4 99.8 31l52.6-52.6L295 73c-6.9-6.9-8.9-17.2-5.2-26.2zM400 80l0 0h0v0zM176 416a112 112 0 1 0 0-224 112 112 0 1 0 0 224z"
		/></svg
	>
{:else if name === 'venus'}
	<svg {style} xmlns="http://www.w3.org/2000/svg" height="1em" viewBox="0 0 448 512"
		><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path
			d="M80 176a112 112 0 1 1 224 0A112 112 0 1 1 80 176zM224 349.1c81.9-15 144-86.8 144-173.1C368 78.8 289.2 0 192 0S16 78.8 16 176c0 86.3 62.1 158.1 144 173.1V384H128c-17.7 0-32 14.3-32 32s14.3 32 32 32h32v32c0 17.7 14.3 32 32 32s32-14.3 32-32V448h32c17.7 0 32-14.3 32-32s-14.3-32-32-32H224V349.1z"
		/></svg
	>
{:else if name === 'spark'}
	<svg {style} xmlns="http://www.w3.org/2000/svg" height="3em" viewBox="0 0 448 512">
		<rect fill="none" height="256" width="256" />
		<path
			d="M138.7,175.5l-19.2,52.1a8,8,0,0,1-15,0L85.3,175.5a8.1,8.1,0,0,0-4.8-4.8L28.4,151.5a8,8,0,0,1,0-15l52.1-19.2a8.1,8.1,0,0,0,4.8-4.8l19.2-52.1a8,8,0,0,1,15,0l19.2,52.1a8.1,8.1,0,0,0,4.8,4.8l52.1,19.2a8,8,0,0,1,0,15l-52.1,19.2A8.1,8.1,0,0,0,138.7,175.5Z"
			fill="none"
			stroke="#000"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="15"
		/>
		<line
			fill="none"
			stroke="#000"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="15"
			x1="176"
			x2="176"
			y1="16"
			y2="64"
		/>
		<line
			fill="none"
			stroke="#000"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="15"
			x1="200"
			x2="152"
			y1="40"
			y2="40"
		/>
		<line
			fill="none"
			stroke="#000"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="15"
			x1="224"
			x2="224"
			y1="72"
			y2="104"
		/>
		<line
			fill="none"
			stroke="#000"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="15"
			x1="240"
			x2="208"
			y1="88"
			y2="88"
		/>
	</svg>
{:else if name === 'spark-full'}
	<svg {style} xmlns="http://www.w3.org/2000/svg" height="3em" viewBox="0 0 448 512">
		<rect fill="none" height="256" width="256" />
		<path
			d="M138.7,175.5l-19.2,52.1a8,8,0,0,1-15,0L85.3,175.5a8.1,8.1,0,0,0-4.8-4.8L28.4,151.5a8,8,0,0,1,0-15l52.1-19.2a8.1,8.1,0,0,0,4.8-4.8l19.2-52.1a8,8,0,0,1,15,0l19.2,52.1a8.1,8.1,0,0,0,4.8,4.8l52.1,19.2a8,8,0,0,1,0,15l-52.1,19.2A8.1,8.1,0,0,0,138.7,175.5Z"
			fill="#000"
			stroke="#000"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="15"
		/>
		<line
			fill="none"
			stroke="#000"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="15"
			x1="176"
			x2="176"
			y1="16"
			y2="64"
		/>
		<line
			fill="none"
			stroke="#000"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="15"
			x1="200"
			x2="152"
			y1="40"
			y2="40"
		/>
		<line
			fill="none"
			stroke="#000"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="15"
			x1="224"
			x2="224"
			y1="72"
			y2="104"
		/>
		<line
			fill="none"
			stroke="#000"
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="15"
			x1="240"
			x2="208"
			y1="88"
			y2="88"
		/>
	</svg>
{/if}

{#if theme === 'dark'}
	<style>
		svg {
			fill: var(--dark_secondary);
		}
	</style>
{:else if theme === 'light'}
	<style>
		svg {
			fill: var(--light_secondary);
		}
	</style>
{:else}
	<style>
		svg {
			fill: var(--text);
		}
	</style>
{/if}
