<script lang="ts">
	import Sprite from '$/ui/atoms/pokemon/sprite/Sprite.svelte';

	export let id: number;
	export let link: string;
	export let variety: string | undefined = undefined;
	export let inEditMode: boolean = false;
	export let onEditClick: (initiator: string) => void;
</script>

{#if id === -1}
	<button
		class={`partySprite empty${inEditMode ? ' editMode' : ''}`}
		on:click={() => {
			if (inEditMode) {
				onEditClick('add');
			}
		}}
	>
		{#if inEditMode}
			<div>
				<p>Add</p>
			</div>
		{:else}
			<div />
		{/if}
	</button>
{:else if inEditMode}
	<div style="height: 5rem;">
		<button
			class="partySprite swap editMode"
			on:click={() => {
				if (inEditMode) {
					onEditClick('swap');
				}
			}}
		>
			<p>Swap</p>

			<Sprite {id} {variety} style="margin: 1rem;" />
		</button>
	</div>
{:else}
	<a href={link} class="partySprite swap">
		<Sprite {id} {variety} style="margin: 1rem;" />
	</a>
{/if}

<style>
	.partySprite,
	.partySprite > div {
		background-color: var(--card-background-light);
		height: 5rem;
		width: 5rem;
		border-radius: 100%;
		display: grid;
		/* align-content: center; */
	}

	.partySprite.swap.editMode > p {
		position: absolute;
		z-index: 100;
		height: 5rem;
		width: 5rem;
		color: var(--text-inverse-light);
		align-content: center;
		background-color: rgba(1, 1, 1, 0.5);
		border-radius: 100%;
	}

	.partySprite.empty:not(.editMode):hover {
		cursor: default;
	}

	.partySprite.empty.editMode {
		background-color: var(--card-hover-light);
	}

	.partySprite.empty.editMode > div {
		background-color: rgba(1, 1, 1, 0.2);
		display: grid;
		align-content: center;
	}

	.partySprite.editMode:hover {
		background-color: var(--card-hover-dark);
	}
</style>
