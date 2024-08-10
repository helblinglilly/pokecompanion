<script lang="ts">
	import {
		getGameFromName,
		getGameGroupFromGame,
		getPokemonEntry,
		type IGame,
		type PokeapiVersionNames
	} from '$/lib/data/games';

	import Button from '$/ui/atoms/button';
	import Modal from '$/ui/molecules/Modal/Modal.svelte';
	import { derived, writable } from 'svelte/store';
	import Progress from '$/ui/molecules/progress';
	import SelectPokemon from './SelectPokemon.svelte';
	import { type IBasePokemon } from '$/lib/types/ITeams';
	import { type IProgress } from '$/ui/molecules/progress/types';
	import PickMoves from './PickMoves.svelte';
	import { getMultiLanguageName } from '$/lib/utils/language';
	import { primaryLanguage, secondaryLanguage } from '$/lib/stores/domain';
	import Summary from './Summary.svelte';

	export let teamId: string;
	export let game: PokeapiVersionNames;

	let showOverlay = false;

	let pokemon = writable<IBasePokemon>({
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
	});

	const gameGroup = getGameGroupFromGame(getGameFromName(game) as unknown as IGame | undefined);

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
		// {
		// 	label: 'Extras',
		// 	disabled: true,
		// 	active: false
		// },
		{
			label: 'Summary',
			disabled: true,
			active: false
		}
	]);
	const activeStep = derived(steps, (allValues) => {
		return allValues.findIndex((val) => val.active) ?? 0;
	});

	pokemon.subscribe((newMon) => {
		steps.set(
			$steps.map((step, i) => ({
				...step,
				disabled: newMon.national_dex === -1 && i !== 0
			}))
		);
	});
</script>

<Button
	classes="h-2 text-sm min-h-[4rem] md:min-h-fit"
	variant="accent"
	on:click={() => {
		showOverlay = true;
	}}
>
	Add Pokémon
</Button>
<Modal bind:showModal={showOverlay} classes="md:w-[40rem] h-full">
	<div slot="header">
		<h2 class="h2">
			Add {$pokemon.national_dex !== -1
				? $pokemon.nickname ??
				  getMultiLanguageName(
						getPokemonEntry($pokemon.national_dex).names,
						$primaryLanguage,
						$secondaryLanguage
				  )
				: 'Pokémon'} to team
		</h2>

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

	<div slot="footer">
		<div class="inline-flex justify-between w-full footerNavigation p-4">
			<div class="px-4">
				{#if $activeStep === 0}
					<Button
						variant="secondary"
						on:click={() => {
							showOverlay = false;
						}}>Close</Button
					>
				{:else}
					<Button
						variant="secondary"
						on:click={() => {
							steps.set(
								$steps.map((step, i) => ({
									...step,
									active: $activeStep - 1 === i
								}))
							);
						}}>Back</Button
					>
				{/if}
			</div>

			<div class="px-4">
				{#if $activeStep !== $steps.length - 1}
					<Button
						variant="accent"
						isDisabled={$pokemon.national_dex <= 0}
						on:click={() => {
							steps.set(
								$steps.map((step, i) => ({
									...step,
									active: $activeStep + 1 === i
								}))
							);
						}}
					>
						{#if $activeStep === 1}
							{$pokemon.move1 === 0 ? 'Skip' : 'Continue'}
						{:else}
							Continue
						{/if}
					</Button>
				{:else}
					<Button
						variant="accent"
						on:click={async () => {
							const res = await fetch(`/api/teams/${teamId}/pokemon`, {
								method: 'POST',
								body: JSON.stringify({
									pokemon: {
										...$pokemon
									}
								})
							});
						}}>Add Pokémon</Button
					>
				{/if}
			</div>
		</div>
	</div>

	<div class="mb-24">
		{#if $activeStep === 0}
			<SelectPokemon {pokemon} game={gameGroup} />
		{:else if $activeStep === 1}
			<PickMoves {pokemon} game={gameGroup} />
			<!-- {:else if $activeStep === 2}
			<p>Extras</p> -->
		{:else}
			<Summary {pokemon} game={gameGroup} />
		{/if}
	</div>
</Modal>

<style>
	.footerNavigation {
		background-color: var(--card-hover);
	}
</style>
