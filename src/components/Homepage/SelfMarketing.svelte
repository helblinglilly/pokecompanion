<script lang="ts">
	import { homepageMessaging } from '$lib/stores/domain';
</script>

<div class="columns">
	<div class="column">
		<div class="card">
			<h1 class="h2">View your favourite Pokémon</h1>
			<p>
				Take a look at <a href="/pokemon/194?variety=wooper-paldea">Paldean Wooper</a>, isn't he
				just great?
			</p>
			<p>Learn about a Pokémon's types, evolution chain, Pokédex entries, moveset and more!</p>
		</div>
	</div>

	<div class="column">
		<div class="card">
			<h2 class="h3">Bi-lingual</h2>
			<p>
				Did you play Pokémon in a different language, or have a friend that did? You can change the
				language and display up to two at once.
			</p>
			<p>
				This even works <a href="/search?term=bisasam&primaryLanguage=fr&secondaryLanguage=de"
					>within the Search!</a
				>
			</p>
		</div>
	</div>

	<div class="column">
		<div class="card">
			<h2 class="h3">Organise!</h2>
			<p>
				Tag your Pokémon, items, moves, and organise to your hearts content. Finishing a <a
					href="/user/users62794/tags/min1e9lqlltz1vr?view=list">Pokédex</a
				>, building a <a href="/user/users62794/tags/e5io1v0x8y6o1lo?view=list#398">Team</a>
				or keeping track of your favourite
				<a href="/user/users62794/tags/macq7c95innrbx8?view=card">plushies</a>? No problem!
			</p>
		</div>
	</div>
</div>

<style>
	@media screen and (max-width: 768px) {
		.column {
			padding-left: 0;
			padding-right: 0;
		}
	}

	@media screen and (min-width: 768px) {
		.column:first-child {
			padding-left: 0;
		}
		.column:last-child {
			padding-right: 0;
		}
	}
</style>
