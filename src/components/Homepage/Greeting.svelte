<script lang="ts">
	import { GameGroups } from '$/lib/data/games';
	import { currentUser } from '$/lib/stores/user';

	let trainerName = $currentUser?.username || 'Trainer';
</script>

<div class="columns gap-4">
	<div class="column">
		<div style="display: inline-flex;">
			<img
				src="favicon.png"
				alt="Pokecompanion Icon"
				width="75px"
				height="75px"
				style="margin-top: auto; margin-bottom: auto;"
			/>
			<h1 class="h2" style="margin-top: auto; margin-bottom: auto; padding-bottom: 0.25rem;">
				Welcome, {trainerName}!
			</h1>
		</div>
	</div>

	<div class="column">
		<div class="mt-auto mb-auto h-full">
			<p class="h-full">
				Explore the world from Kanto to {GameGroups[GameGroups.length - 1].region} efficiently with Pokécompanion.
				<br />
				Browsing and organising Pokémon, Moves, Abilities and more in a
				<a href="/pokemon/78" class="underline">Rapidash</a>!
			</p>
		</div>
	</div>
</div>
