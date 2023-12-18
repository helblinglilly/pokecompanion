<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { pokemonDisplayStore } from '$lib/stores/pokemonPageStore';
	import { capitaliseFirstLetter } from '$lib/utils/string';
	import Image from './Image.svelte';

	export let title: string;
	export let currentId: number;
	export let maxId: number;
	export let iconUrl: string | undefined;
	export let route: string;
	export let forms: { name: string }[];
</script>

<div id="navigator" class="columns mobile">
	<div class="column" style="max-width: fit-content; display: contents;">
		<div style="min-width: 90px; min-height: 70px;">
			<a
				href={`${route}/${currentId - 1}`}
				class={`card ${currentId - 1 <= 0 ? 'hidden' : ''}`}
				style="width: fit-content; padding: 10px;"
			>
				<div style="display: inline-flex;">
					<p style="margin: auto;">#{currentId - 1}</p>
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
	<div class="column" style="display: flex; align-items: center; max-width: fit-content;">
		<h2 class="mobile-only" id="pokemonId">
			#{currentId}
		</h2>

		<div class="desktop-only">
			<div style="display: inline-block; gap: 1rem;">
				<h2
					id="pokemonName"
					style="min-width: fit-content; margin-top: auto; margin-bottom: auto; padding-bottom: 0; text-align: center;"
				>
					{title}
				</h2>

				{#if forms.length > 1}
					<select
						id="formSelector-desktop"
						name="variety"
						on:change={(e) => {
							if (e.target) {
								const newUrl = new URL($page.url);
								if (e.target.value.endsWith('-default')) {
									newUrl.searchParams.delete('variety');
									goto(newUrl.toString(), { replaceState: false });
								} else {
									newUrl.searchParams.set('variety', e.target.value);
									goto(newUrl.toString(), { replaceState: false });
								}
							}
						}}
					>
						{#each forms as form}
							<option value={form.name} selected={form.name === $pokemonDisplayStore.variety?.name}
								>{capitaliseFirstLetter(form.name.split('-').splice(1).join(' '))}</option
							>
						{/each}
					</select>
				{/if}
			</div>
		</div>
	</div>

	<div class="column" style="justify-content: end; display: contents; max-width: fit-content;">
		<div style="min-width: 90px; min-height: 70px;">
			<a
				href={`${route}/${currentId + 1}`}
				class={`card ${currentId + 1 > maxId ? 'hidden' : ''}`}
				style="width: fit-content; padding: 10px;"
			>
				<div style="display: inline-flex;">
					<p style="margin: auto;">#{currentId + 1}</p>
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
	<div class="columns" style="justify-content: space-between;">
		<div class="column">
			<h2 style="text-align: center;">{title}</h2>

			{#if forms.length > 1}
				<div style="display: inline-flex; width: 100%; justify-content: space-around;">
					<select
						id="formSelector-mobile"
						name="variety"
						on:change={(e) => {
							if (e.target) {
								const newUrl = new URL($page.url);
								if (e.target.value.endsWith('-default')) {
									newUrl.searchParams.delete('variety');
									goto(newUrl.toString(), { replaceState: true });
								} else {
									newUrl.searchParams.set('variety', e.target.value);
									goto(newUrl.toString(), { replaceState: true });
								}
							}
						}}
					>
						{#each forms as form}
							<option value={form.name} selected={form.name === $pokemonDisplayStore.variety?.name}
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
