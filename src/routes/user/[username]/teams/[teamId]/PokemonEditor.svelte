<script lang="ts">
	import { getGameFromName, getGameGroupFromGame, type IGame } from '$/lib/data/games';

	import Button from '$/ui/atoms/button';
	import Modal from '$/ui/molecules/Modal/Modal.svelte';
	import { derived, writable, type Writable } from 'svelte/store';
	import Progress from '$/ui/molecules/progress';
	import SelectPokemon from './Boxes/SelectPokemon.svelte';
	import { type IBasePokemon, type ITeam } from '$/lib/types/ITeams';
	import { type IProgress } from '$/ui/molecules/progress/types';
	import PickMoves from './Boxes/PickMoves.svelte';
	import Summary from './Boxes/Summary.svelte';
	import { createEventDispatcher, getContext } from 'svelte';

	export let showOverlay: Writable<boolean>;
	export let existingPokemon: Readonly<IBasePokemon> | undefined = undefined;

	const dispatch = createEventDispatcher();

	const blankPokemon: Readonly<IBasePokemon> = existingPokemon ?? {
		national_dex: -1,
		nickname: undefined,
		variety: undefined,
		gender: 'unknown',
		shiny: false,
		ability: 0,
		move1: 0,
		move2: 0,
		move3: 0,
		move4: 0
	};

	const pokemon = writable({ ...blankPokemon });

	const team = getContext('teamView') as Writable<ITeam>;
	const gameGroup = getGameGroupFromGame(
		getGameFromName($team.game) as unknown as IGame | undefined
	);

	const steps = writable<IProgress[]>([
		{
			label: 'Species',
			disabled: false,
			active: true
		},
		{
			label: 'Moves',
			disabled: true,
			active: false
		},
		{
			label: 'Summary',
			disabled: true,
			active: false
		}
	]);

	const activeStep = derived(steps, (allValues) => {
		return allValues.findIndex((val) => val.active) ?? 0;
	});

	showOverlay.subscribe(() => {
		pokemon.set({ ...blankPokemon });
	});
</script>

<Modal bind:showModal={$showOverlay} classes="md:w-[40rem] h-full">
	<div slot="header">
		<slot name="title" />

		<hr style="margin-left: -2rem; width: calc(100% + 2rem); border-color: var(--text);" />

		<div class="w-full py-4">
			<Progress
				on:progressOption={({ detail }) => {
					steps.set(
						$steps.map((step, i) => ({
							...step,
							active: i === detail
						}))
					);
				}}
				{steps}
			/>
		</div>
	</div>

	<div class="mb-24">
		{#if $activeStep === 0}
			<SelectPokemon {pokemon} game={gameGroup} />
		{:else if $activeStep === 1}
			<PickMoves {pokemon} game={gameGroup} />
		{:else}
			<Summary {pokemon} game={gameGroup} />
		{/if}
	</div>

	<div slot="footer">
		<div class="inline-flex justify-between w-full footerNavigation p-4">
			<div class="px-4">
				<Button
					variant="primary"
					on:click={() => {
						if ($activeStep === 0) {
							showOverlay.set(false);
						} else {
							steps.set(
								$steps.map((step, i) => ({
									...step,
									active: $activeStep - 1 === i
								}))
							);
						}
					}}>{$activeStep === 0 ? 'Close' : 'Back'}</Button
				>
			</div>

			<div class="px-4">
				<Button
					variant="primary"
					isDisabled={$steps[$activeStep].disabled}
					on:click={() => {
						if ($activeStep === $steps.length - 1) {
							dispatch('save', $pokemon);
						} else {
							steps.set(
								$steps.map((entry, index) => {
									return {
										...entry,
										active: index === $activeStep + 1,
										disabled: false
									};
								})
							);
						}
					}}>{$activeStep === $steps.length - 1 ? 'Save' : 'Next'}</Button
				>
			</div>
		</div>
	</div>
</Modal>

<style>
	.footerNavigation {
		background-color: var(--card-hover);
	}
</style>
