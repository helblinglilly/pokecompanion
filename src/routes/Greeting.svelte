<script lang="ts">
	import { currentUser } from '$/lib/stores/user';

	let trainerName = $currentUser?.username || 'Trainer';
</script>

<div class="gap-4">
	<div class="inline-flex gap-4">
		<img
			src="favicon.png"
			alt="Pokecompanion Icon"
			width="90px"
			height="90px"
			style="margin-top: auto; margin-bottom: auto;"
		/>
		<div>
			<h1 class="h2" style="margin-top: auto; margin-bottom: auto; padding-bottom: 0.25rem;">
				Welcome, {trainerName}!
			</h1>

			<div class="mt-auto mb-auto h-full">
				{#if $currentUser}
					<p>What are we doing today? Let's get you back into the game asap!</p>
				{:else}
					<p class="h-full">
						Explore the world from Kanto to Lumiose City efficiently with Pokécompanion.
						<br />
						Browsing and organising Pokémon, Moves, Abilities and more in a
						<a href="/pokedex/1/pokemon/78" class="underline">Rapidash</a>!
					</p>
				{/if}
			</div>
		</div>
	</div>
</div>
