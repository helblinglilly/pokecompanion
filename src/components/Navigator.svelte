<script lang="ts">
	import Image from './Image.svelte';

	export let title: string;
	export let currentId: number;
	export let maxId: number;
	export let iconUrl: string | undefined;
	export let route: string;
</script>

<div class="columns mobile" style="justify-content: space-between;">
	<div class="column" style="max-width: fit-content;">
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
						/>
					{:else}
						<Image src="/placeholder.png" alt="icon" classNames="icon" loading="eager" />
					{/if}
				</div>
			</a>
		{/if}
	</div>
	<div class="column" style="display: flex; align-items: center; max-width: fit-content;">
		<h2 class="mobile-only">
			#{currentId}
		</h2>

		<h2 class="desktop-only">
			{title}
		</h2>
	</div>
	<div class="column" style="justify-content: end; display: grid; max-width: fit-content;">
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
