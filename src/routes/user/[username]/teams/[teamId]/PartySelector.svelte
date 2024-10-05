<script lang="ts">
	import type { ITeam } from '$/lib/types/ITeams';
	import Modal from '$/ui/molecules/Modal/Modal.svelte';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import Card from '$/ui/atoms/card/Card.svelte';
	import {
		getGameGroupFromGame,
		getPokemonEntry,
		getGameFromName,
		type IGame
	} from '$/lib/data/games';
	import { getMultiLanguageName } from '$/lib/utils/language';
	import { primaryLanguage, secondaryLanguage } from '$/lib/stores/domain';
	import Sprite from '$/ui/atoms/pokemon/sprite';
	import PokemonMoves from './PokemonMoves.svelte';
	import { addNotification } from '$/lib/stores/notifications';

	export let isVisible: Writable<boolean>;
	export let partySlot: number;

	$: currentEntry = $team.party[partySlot];

	$: populatedPartyEntries = $team.party.filter((a) => a.national_dex > 0);

	const team = getContext('teamView') as Writable<ITeam>;
	const gameGroup = getGameGroupFromGame(
		getGameFromName($team.game) as unknown as IGame | undefined
	);
</script>

<Modal bind:showModal={$isVisible}>
	<h2 class="h2" slot="header">Party slot {partySlot + 1}</h2>

	{#if $team.bench.length > 0}
		<h2 class="h2">Benched Pokémon</h2>
		<div class="grid md:grid-cols-2 gap-4">
			{#each $team.bench as benchMon}
				<Card
					classes="w-full flex flex-rows"
					isClickable
					on:click={async () => {
						const newParty = [...$team.party];
						newParty[partySlot] = benchMon;

						const res = await fetch(`/api/teams/${$team.id}/party`, {
							method: 'PATCH',
							body: JSON.stringify({
								party: newParty
							})
						});

						if (!res.ok) {
							isVisible.set(false);
							addNotification({
								level: 'failure',
								message: 'Failed to update party'
							});

							return;
						}

						const newBench = $team.bench.filter((a) => a.id !== benchMon.id);

						team.set({
							...$team,
							party: newParty,
							bench: newBench
						});

						isVisible.set(false);
					}}
				>
					<div class="pr-4">
						<Sprite
							{...benchMon}
							female={benchMon.gender === 'female'}
							id={benchMon.national_dex}
							gameOverride={gameGroup}
						/>
					</div>
					<div class="mt-auto mb-auto">
						<h2 class="h2 p-0">
							{benchMon.nickname && benchMon.nickname.length > 0
								? benchMon.nickname
								: getMultiLanguageName(
										getPokemonEntry(benchMon.national_dex).names,
										$primaryLanguage,
										$secondaryLanguage
								  )}
						</h2>

						<PokemonMoves pokemon={benchMon} game={gameGroup} />
					</div>
				</Card>
			{/each}
		</div>
	{/if}
</Modal>
