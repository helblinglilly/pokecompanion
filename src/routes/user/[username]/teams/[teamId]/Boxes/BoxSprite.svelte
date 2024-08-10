<script lang="ts">
	import type { IGameGroups } from '$/lib/data/games';
	import Sprite from '$/ui/atoms/pokemon/sprite/Sprite.svelte';

	export let id: number;
	export let variety: string | undefined = undefined;
	export let inModifyView: boolean = false;
	export let onViewClick: () => void;
	export let onEditClick: (initiator: string) => void;
	export let game: IGameGroups | undefined;
</script>

{#if inModifyView}
	<div style="height: 5rem;">
		<button
			class="partySprite swap editMode"
			on:click={() => {
				if (inModifyView) {
					onEditClick('swap');
				}
			}}
		>
			<p>Edit</p>

			<Sprite
				{id}
				{variety}
				style="margin: 1rem;"
				gameOverride={game}
				imageClasses="max-h-12 max-w-12"
			/>
		</button>
	</div>
{:else}
	<button
		class="partySprite swap"
		on:click={() => {
			onViewClick();
		}}
	>
		<Sprite
			{id}
			{variety}
			style="margin: 1rem;"
			gameOverride={game}
			imageClasses="max-h-12 max-w-12"
		/>
	</button>
{/if}

<style>
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

	.partySprite.editMode:hover {
		background-color: var(--card-hover-dark);
	}
</style>
