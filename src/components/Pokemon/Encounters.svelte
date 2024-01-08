<script lang="ts">
	import { navigating } from '$app/stores';
	import { games, type IGame } from '$lib/data/games';
	import { selectedGame } from '$lib/stores/domain';
	import { uniques } from '$lib/utils/array';
	import { capitaliseEachWord } from '$lib/utils/string';
	import { onMount } from 'svelte';

	export let id: number;
	let selectedLocation = -1;
	let isLoading = false;

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
		location: {
			name: string;
			url: string;
		};
		methods?: {
			method: {
				name: string;
			};
			min_level: number;
			max_level: number;
			chance: number;
		}[];
		games: IGame[];
	}

	let encounters: IData[] = [];

	const fetchData = async () => {
		const req = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}/encounters`);
		const body = (await req.json()) as IReponse[];

		const locations: IData[] = [];
		body.forEach((encounter) => {
			encounter.version_details
				.filter((version) => {
					if (!$selectedGame) {
						return true;
					} else {
						return $selectedGame.pokeapiName === version.version.name;
					}
				})
				.forEach((gameEntry) => {
					let existingLocation = locations.find((location) => {
						return encounter.location_area.url === location.location.url;
					});

					const groupedMethods = gameEntry.encounter_details.reduce(
						(acc: { [key: string]: any }, detail) => {
							if (!acc[detail.method.name]) {
								acc[detail.method.name] = {
									chance: 0,
									max_level: 0,
									min_level: Infinity,
									method: detail.method
								};
							}
							acc[detail.method.name].chance += detail.chance;
							acc[detail.method.name].max_level = Math.max(
								acc[detail.method.name].max_level,
								detail.max_level
							);
							acc[detail.method.name].min_level = Math.min(
								acc[detail.method.name].min_level,
								detail.min_level
							);
							return acc;
						},
						{}
					);

					if (!existingLocation) {
						locations.push({
							location: encounter.location_area,
							methods: Object.values(groupedMethods),
							games: games.filter((a) => a.pokeapiName === gameEntry.version.name)
						});
					}
				});
		});
		return locations;
	};

	onMount(async () => {
		isLoading = true;
		encounters = [];
		const data = await fetchData();
		encounters = uniques(data);
		isLoading = false;
	});

	$: {
		if (id) {
			isLoading = true;
			encounters = [];
			fetchData().then((data) => {
				encounters = uniques(data);
				isLoading = false;
			});
		}
	}
</script>

<div>
	{#if encounters.length === 0}
		{#if isLoading}
			<p style="text-align: center;">Loading...</p>
		{:else}
			<p style="text-align: center;">This Pokémon cannot be found in the wild</p>
		{/if}
	{/if}
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
			<!-- Need to add indicators for version exclusivity -->

			<h4>{capitaliseEachWord(encounter.location.name.replaceAll('-', ' '))}</h4>
			<div class="extendedWrapper" style={`${selectedLocation !== i ? 'display: none;' : ''}`}>
				{#if encounter.methods}
					<table style="width: 100%;">
						<thead>
							<th>Method</th>
							<th>Level</th>
							<th>Chance</th>
						</thead>
						<tbody>
							{#each encounter.methods as method}
								<tr>
									<td>{capitaliseEachWord(method.method.name.replaceAll('-', ' '))}</td>
									<p>
										Lv. {method.min_level === method.max_level
											? method.min_level
											: `${method.min_level} - ${method.max_level}`}
									</p>
									<td>{method.chance}%</td>
								</tr>
							{/each}
						</tbody>
					</table>
				{/if}
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

	.extendedWrapper {
		justify-content: start;
	}
</style>
