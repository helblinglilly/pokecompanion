<script lang="ts">
	import Image from './Image.svelte';

	export let title: string;
	export let currentId: number;
	export let maxId: number;
	export let iconUrl: string | undefined;
	export let route: string;
</script>

<div id="navigator" class="columns mobile">
	<div class="column" style="max-width: fit-content; display: contents;">
		{#if currentId - 1 > 0}
			<a href={`${route}/${currentId - 1}`} class="card" style="width: fit-content; padding: 10px;">
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
		{/if}
	</div>
	<div class="column" style="display: flex; align-items: center; max-width: fit-content;">
		<h2 class="mobile-only" id="pokemonId">
			#{currentId}
		</h2>

		<h2 class="desktop-only" id="pokemonName">
			{title}
		</h2>
	</div>
	<div class="column" style="justify-content: end; display: contents; max-width: fit-content;">
		{#if currentId + 1 <= maxId}
			<a href={`${route}/${currentId + 1}`} class="card" style="width: fit-content; padding: 10px;">
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
		{/if}
	</div>
</div>

<div class="mobile-only">
	<div class="columns" style="justify-content: space-between;">
		<div class="column">
			<h2 style="text-align: center;">{title}</h2>
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
</style>
