<script lang="ts">
	import { selectedGame } from '$lib/stores/domain';
	import { capitaliseFirstLetter } from '$lib/utils/string';
	import { onMount } from 'svelte';

	export let id: number;
	let selectedLocation = -1;

	interface IReponse {
		location_area: {
			name: string;
			url: string;
		};
		version_details: {
			max_chance: number;
			version: {
				name: string; // short name 'black' or 'white'
				url: string;
			};
			encounter_details: {
				chance: number;
				max_level: number;
				min_level: number;
				condition_value: {}[];
				method: {
					name: string;
					url: string;
				};
			}[];
		}[];
	}

	interface IData {
		details: {
			max_chance: number;
			version: {
				name: string; // short name 'black' or 'white'
				url: string;
			};
			encounter_details: {
				chance: number;
				max_level: number;
				min_level: number;
				method: {
					name: string;
					url: string;
				};
			}[];
		};
		location: {
			name: string;
			url: string;
		};
	}

	let encounters: IData[] = [];

	const fetchData = async () => {
		const req = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/encounters`);
		const body = (await req.json()) as IReponse[];

		const data: IData[] = [];
		body.forEach((encounter) => {
			encounter.version_details.forEach((version) => {
				let match = false;
				if ($selectedGame) {
					if ($selectedGame.pokeapiName === version.version.name) {
						match = true;
					}
				} else {
					match = true;
				}

				if (match) {
					data.push({
						location: {
							...encounter.location_area
						},
						details: encounter.version_details.filter((a) => {
							if (!$selectedGame) {
								return true;
							}
							return $selectedGame.pokeapiName === a.version.name;
						})[0]
					});
				}
			});
		});
		return data;
	};

	onMount(async () => {
		encounters = [];
		encounters = await fetchData();
	});

	$: {
		fetchData();
	}
</script>

<div>
	{#each encounters as encounter, i}
		<button
			class="card"
			on:click={() => {
				if (selectedLocation !== i) {
					selectedLocation = i;
				} else {
					selectedLocation = -1;
				}
			}}
		>
			<h4>{encounter.location.name}</h4>

			<div style={`${selectedLocation === i ? 'display: block;' : 'display: none;'}`}>
				{#each encounter.details.encounter_details as details}
					<p>Method: {capitaliseFirstLetter(details.method.name)}</p>
					<p>Levels: {details.min_level} to {details.max_level}</p>
					<p>Odds: {details.chance}%</p>
					<!-- <p>Chance: {details.encounter_details} - {encounter.details.max_chance}</p> -->
					<!-- <p>{JSON.stringify(details)}</p> -->
				{/each}
			</div>
		</button>
	{/each}
</div>

<style>
	button.card {
		background-color: var(--secondary);
		margin-bottom: 1rem;
	}
	button.card:hover {
		background-color: var(--primary);
	}
</style>
