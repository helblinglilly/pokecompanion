<script lang="ts">
	export let name:
		| 'tag'
		| 'tags'
		| 'lock'
		| 'mars'
		| 'venus'
		| 'spark'
		| 'spark-full'
		| 'list'
		| 'card'
		| 'pencil'
		| 'floppy';
	export let theme: 'dark' | 'light' | null = null;
	export let style: string | null = null;
	export let pathStroke: string | null = null;
	export let lineStroke: string | null = null;
	export let pathFill: string | null = null;
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
		<path
			d="M138.7,175.5l-19.2,52.1a8,8,0,0,1-15,0L85.3,175.5a8.1,8.1,0,0,0-4.8-4.8L28.4,151.5a8,8,0,0,1,0-15l52.1-19.2a8.1,8.1,0,0,0,4.8-4.8l19.2-52.1a8,8,0,0,1,15,0l19.2,52.1a8.1,8.1,0,0,0,4.8,4.8l52.1,19.2a8,8,0,0,1,0,15l-52.1,19.2A8.1,8.1,0,0,0,138.7,175.5Z"
			fill="none"
			stroke={pathStroke ?? '#000'}
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="15"
		/>
		<line
			fill="none"
			stroke={lineStroke ?? '#000'}
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
			stroke={lineStroke ?? '#000'}
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
			stroke={lineStroke ?? '#000'}
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
			stroke={lineStroke ?? '#000'}
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
		<path
			d="M138.7,175.5l-19.2,52.1a8,8,0,0,1-15,0L85.3,175.5a8.1,8.1,0,0,0-4.8-4.8L28.4,151.5a8,8,0,0,1,0-15l52.1-19.2a8.1,8.1,0,0,0,4.8-4.8l19.2-52.1a8,8,0,0,1,15,0l19.2,52.1a8.1,8.1,0,0,0,4.8,4.8l52.1,19.2a8,8,0,0,1,0,15l-52.1,19.2A8.1,8.1,0,0,0,138.7,175.5Z"
			fill={pathFill ?? '#000'}
			stroke={pathStroke ?? '#000'}
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="15"
		/>
		<line
			fill="none"
			stroke={lineStroke ?? '#000'}
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
			stroke={lineStroke ?? '#000'}
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
			stroke={lineStroke ?? '#000'}
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
			stroke={lineStroke ?? '#000'}
			stroke-linecap="round"
			stroke-linejoin="round"
			stroke-width="15"
			x1="240"
			x2="208"
			y1="88"
			y2="88"
		/>
	</svg>
{:else if name === 'list'}
	<svg {style} xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"
		><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path
			d="M40 48C26.7 48 16 58.7 16 72v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V72c0-13.3-10.7-24-24-24H40zM192 64c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zm0 160c-17.7 0-32 14.3-32 32s14.3 32 32 32H480c17.7 0 32-14.3 32-32s-14.3-32-32-32H192zM16 232v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V232c0-13.3-10.7-24-24-24H40c-13.3 0-24 10.7-24 24zM40 368c-13.3 0-24 10.7-24 24v48c0 13.3 10.7 24 24 24H88c13.3 0 24-10.7 24-24V392c0-13.3-10.7-24-24-24H40z"
		/></svg
	>
{:else if name === 'card'}
	<svg {style} xmlns="http://www.w3.org/2000/svg" height="16" width="12" viewBox="0 0 384 512"
		><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path
			d="M192 0c-41.8 0-77.4 26.7-90.5 64H64C28.7 64 0 92.7 0 128V448c0 35.3 28.7 64 64 64H320c35.3 0 64-28.7 64-64V128c0-35.3-28.7-64-64-64H282.5C269.4 26.7 233.8 0 192 0zm0 64a32 32 0 1 1 0 64 32 32 0 1 1 0-64zM128 256a64 64 0 1 1 128 0 64 64 0 1 1 -128 0zM80 432c0-44.2 35.8-80 80-80h64c44.2 0 80 35.8 80 80c0 8.8-7.2 16-16 16H96c-8.8 0-16-7.2-16-16z"
		/></svg
	>
{:else if name === 'pencil'}
	<svg {style} xmlns="http://www.w3.org/2000/svg" height="16" width="16" viewBox="0 0 512 512"
		><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path
			d="M410.3 231l11.3-11.3-33.9-33.9-62.1-62.1L291.7 89.8l-11.3 11.3-22.6 22.6L58.6 322.9c-10.4 10.4-18 23.3-22.2 37.4L1 480.7c-2.5 8.4-.2 17.5 6.1 23.7s15.3 8.5 23.7 6.1l120.3-35.4c14.1-4.2 27-11.8 37.4-22.2L387.7 253.7 410.3 231zM160 399.4l-9.1 22.7c-4 3.1-8.5 5.4-13.3 6.9L59.4 452l23-78.1c1.4-4.9 3.8-9.4 6.9-13.3l22.7-9.1v32c0 8.8 7.2 16 16 16h32zM362.7 18.7L348.3 33.2 325.7 55.8 314.3 67.1l33.9 33.9 62.1 62.1 33.9 33.9 11.3-11.3 22.6-22.6 14.5-14.5c25-25 25-65.5 0-90.5L453.3 18.7c-25-25-65.5-25-90.5 0zm-47.4 168l-144 144c-6.2 6.2-16.4 6.2-22.6 0s-6.2-16.4 0-22.6l144-144c6.2-6.2 16.4-6.2 22.6 0s6.2 16.4 0 22.6z"
		/></svg
	>
{:else if name === 'floppy'}
	<svg {style} xmlns="http://www.w3.org/2000/svg" height="16" width="14" viewBox="0 0 448 512"
		><!--!Font Awesome Free 6.5.1 by @fontawesome - https://fontawesome.com License - https://fontawesome.com/license/free Copyright 2023 Fonticons, Inc.--><path
			d="M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V173.3c0-17-6.7-33.3-18.7-45.3L352 50.7C340 38.7 323.7 32 306.7 32H64zm0 96c0-17.7 14.3-32 32-32H288c17.7 0 32 14.3 32 32v64c0 17.7-14.3 32-32 32H96c-17.7 0-32-14.3-32-32V128zM224 288a64 64 0 1 1 0 128 64 64 0 1 1 0-128z"
		/></svg
	>
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
