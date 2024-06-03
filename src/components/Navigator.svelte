<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { Logger } from '$lib/log';
	import { pokemonDisplayStore } from '$lib/stores/pokemonPage';
	import { capitaliseFirstLetter } from '$lib/utils/string';
	import Image from './UI/Image.svelte';

	export let title: string;
	export let currentId: number;
	export let maxId: number;
	export let route: string;
	export let forms: { name: string }[];

	const iconUrl = 'https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon';
</script>

<div id="navigator" class="columns mobile">
	<div class="column max-w-fit contents">
		<div style="min-width: 90px; min-height: 70px;">
			<a
				href={`${route}/${currentId - 1}${$pokemonDisplayStore.transferableQueryParams}`}
				class={`card ${currentId - 1 <= 0 ? 'hidden' : ''} w-fit h-auto p-2.5`}
				on:click={() => {
					Logger.addPageAction('UIInteraction', 'PokemonNavigation', {
						action: 'Navigation'
					});
				}}
			>
				<div class="inline-flex">
					<p class="m-auto">#{currentId - 1}</p>
					{#if iconUrl}
						<Image
							src={`${iconUrl}/${currentId - 1}.png`}
							alt="icon"
							classNames="icon"
							loading="eager"
							width=""
						/>
					{:else}
						<Image src="/placeholder.png" alt="icon" classNames="icon" loading="eager" />
					{/if}
				</div>
			</a>
		</div>
	</div>
	<div class="column flex items-center max-w-fit">
		<h2 class="mobile-only h2" id="pokemonId">
			#{currentId}
		</h2>

		<div class="desktop-only">
			<div class="inline-block gap-4">
				<h1 class="h2 m-in-w-fit mt-auto mb-auto pb-0 text-center" id="pokemonName">
					{title}
				</h1>

				{#if forms.length > 1}
					<select
						id="formSelector-desktop"
						name="variety"
						on:change={(e) => {
							if (e.target) {
								Logger.addPageAction('UIInteraction', 'Variety', {
									action: 'Navigation'
								});

								const newUrl = new URL($page.url);
								// @ts-ignore complains that .value does not exist
								if (e.target.value.endsWith('-default')) {
									newUrl.searchParams.delete('variety');
									goto(newUrl.toString());
								} else {
									// @ts-ignore complains that .value does not exist
									newUrl.searchParams.set('variety', e.target.value);
									goto(newUrl.toString());
								}
							}
						}}
					>
						{#each forms as form}
							<option value={form.name} selected={form.name === $pokemonDisplayStore.variety}
								>{capitaliseFirstLetter(form.name.split('-').splice(1).join(' '))}</option
							>
						{/each}
					</select>
				{/if}
			</div>
		</div>
	</div>

	<div class="column justify-end contents max-w-fit">
		<div style="min-width: 90px; min-height: 70px;">
			<a
				href={`${route}/${currentId + 1}${$pokemonDisplayStore.transferableQueryParams}`}
				class={`card ${currentId + 1 > maxId ? 'hidden' : ''} w-fit p-2.5 h-auto`}
				on:click={() => {
					Logger.addPageAction('UIInteraction', 'PokemonNavigation', {
						action: 'Navigation'
					});
				}}
			>
				<div class="inline-flex">
					<p class="m-auto">#{currentId + 1}</p>
					{#if iconUrl}
						<Image
							src={`${iconUrl}/${currentId + 1}.png`}
							alt="icon"
							classNames="icon"
							loading="eager"
						/>
					{:else}
						<Image src="/placeholder.png" alt="icon" classNames="icon" loading="eager" />
					{/if}
				</div>
			</a>
		</div>
	</div>
</div>

<div class="mobile-only">
	<div class="columns justify-between">
		<div class="column">
			<h2 class="h2 text-center">{title}</h2>

			{#if forms.length > 1}
				<div class="inline-flex w-full justify-around">
					<select
						id="formSelector-mobile"
						name="variety"
						on:change={(e) => {
							if (e.target) {
								const newUrl = new URL($page.url);
								// @ts-ignore complains that .value does not exist
								if (e.target.value.endsWith('-default')) {
									newUrl.searchParams.delete('variety');
									goto(newUrl.toString());
								} else {
									// @ts-ignore complains that .value does not exist
									newUrl.searchParams.set('variety', e.target.value);
									goto(newUrl.toString());
								}
							}
						}}
					>
						{#each forms as form}
							<option value={form.name} selected={form.name === $pokemonDisplayStore.variety}
								>{capitaliseFirstLetter(form.name.split('-').splice(1).join(' '))}</option
							>
						{/each}
					</select>
				</div>
			{/if}
		</div>
	</div>
</div>

<style>
	#navigator {
		justify-content: space-between;
	}

	@media (min-width: 768px) {
		#navigator {
			padding-left: 10px;
			padding-right: 10px;
		}
	}

	select {
		background-color: var(--accent);
		text-align: center;
		padding: 0;
		margin: 0;
		min-width: 10rem;
	}
</style>
