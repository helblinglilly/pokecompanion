<script lang="ts">
	import Sprite from '$/ui/atoms/pokemon/sprite/Sprite.svelte';

	export let id: number;
	export let link: string;
	export let variety: string | undefined = undefined;
	export let inEditMode: boolean = false;
	export let onEditClick: (initiator: string) => void;
</script>

{#if id === -1}
	{#if inEditMode}
		<button
			class="partySprite"
			on:click={() => {
				if (inEditMode) {
					onEditClick('add');
				}
			}}
		>
			<p>Add</p>
		</button>
	{:else}
		<button
			class="partySprite hover:cursor-default"
			on:click={() => {
				if (inEditMode) {
					onEditClick('add');
				}
			}}
		/>
	{/if}
{:else if inEditMode}
	<div style="height: 4rem;">
		<button
			class="partySprite"
			on:click={() => {
				if (inEditMode) {
					onEditClick('swap');
				}
			}}
		>
			<div>
				<p>Swap</p>
			</div>
			<Sprite {id} {variety} />
		</button>
	</div>
{:else}
	<a href={link} class="partySprite">
		<Sprite {id} {variety} />
	</a>
{/if}

<style>
	.partySprite {
		background-color: var(--card-background-light);
		height: 4rem;
		width: 4rem;
		border-radius: 100%;
	}

	a.partySprite:hover {
		background-color: var(--card-hover-light);
		cursor: pointer;
	}

	.partySprite > div {
		position: absolute;
		width: 4rem;
		height: 4rem;
		z-index: 100;
		background-color: rgb(1, 1, 1, 0.5);
		border-radius: 100%;
		display: grid;
		align-content: center;
	}

	.partySprite > div > p {
		color: var(--text-dark);
	}

	.partySprite > p {
		color: var(--text-light);
	}
</style>
