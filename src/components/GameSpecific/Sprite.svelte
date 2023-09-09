<script lang="ts">
	import type { ISprites } from '$lib/apiTypes';
	import { findBaseSprites, findPrimarySprite, findSecondarySprite } from '$lib/pokemon-id/sprites';

	export let sprites: ISprites;
	$: baseSprite = findBaseSprites(sprites);

	$: hasShiny = baseSprite.front_shiny || baseSprite.back_shiny ? true : false;
	$: isDisplayingShiny = false;

	$: hasFemale = baseSprite.front_female || baseSprite.back_female ? true : false;
	$: isDisplayingFemale = false;

	$: secondarySprite = findSecondarySprite(
		baseSprite,
		hasFemale,
		isDisplayingFemale,
		hasShiny,
		isDisplayingShiny
	);

	$: primarySprite = findPrimarySprite(
		baseSprite,
		hasFemale,
		isDisplayingFemale,
		hasShiny,
		isDisplayingShiny
	);
</script>

<div style="display: flex; justify-content: space-around;">
	<div class="spriteBoxWrapper">
		<i>{primarySprite.alt}</i>
		<div class="spriteWrapper">
			<img src={primarySprite.url} alt={primarySprite.alt} loading="lazy" />
		</div>
	</div>

	<div class="spriteBoxWrapper">
		<i>{secondarySprite.alt}</i>
		<div class="spriteWrapper">
			{#if secondarySprite}
				<img src={secondarySprite.url} alt={secondarySprite.alt} loading="lazy" />
			{/if}
		</div>
	</div>
</div>

<div style="display: flex; justify-content: space-around;">
	{#if hasShiny}
		<span>
			<input
				type="checkbox"
				name="shinyToggle"
				id="shinyToggle"
				on:change={() => (isDisplayingShiny = !isDisplayingShiny)}
				checked={isDisplayingShiny}
			/>
			<label class="checkbox" for="shinyToggle">Shiny</label>
		</span>
	{/if}

	{#if hasFemale}
		<span>
			<input
				type="checkbox"
				name="alternative"
				id="alternative"
				on:change={() => {
					isDisplayingFemale = !isDisplayingFemale;
				}}
				checked={isDisplayingFemale}
			/>
			<label class="checkbox" for="alternative">Female</label>
		</span>
	{/if}
</div>

<!-- Open a modal when the user clicks on either sprite to showcase all sprites -->
<style>
	div.spriteBoxWrapper {
		text-align: center;
		width: 96px;
	}
	div.spriteWrapper {
		width: 96px;
		height: 96px;
	}
</style>
