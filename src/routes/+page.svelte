<script lang="ts">
	import { homepageMessaging } from '$lib/stores/domain';
	import Image from '$components/Image.svelte';
</script>

<svelte:head>
	<title>Pokécompanion</title>
</svelte:head>

{#if $homepageMessaging === 'new-visitor'}
	<h1>Hi! Welcome to Pokécompanion</h1>
	<p>
		Are you a Pokémon fan and currently playing through a mainline game? You'll feel right at home
		here!
	</p>

	<div class="columns">
		<div class="column">
			<div class="card">
				<h2>View your favourite Pokémon</h2>
				<p>
					Take a look at <a href="/pokemon/194?variety=wooper-paldea">Paldean Wooper</a>, isn't he
					just great?
				</p>
				<p>Learn about a Pokémon's types, evolution chain, Pokédex entries, moveset and more!</p>
			</div>
		</div>

		<div class="column">
			<div class="card">
				<h2>Accurate - for your game</h2>
				<p>
					The Pokécompanion will reflect types, sprites and move changes - just set your game in the <a
						href="/settings">Settings</a
					>
				</p>
			</div>
		</div>

		<div class="column">
			<div class="card">
				<h2>Bi-lingual</h2>
				<p>
					Did you play Pokémon in a different language, or have a friend that did? You can change
					the language and display up to two at once.
				</p>
				<p>This even works with the Search!</p>
			</div>
		</div>
	</div>

	<h3>Create an account for even more!</h3>
	<p>
		You will be able to tag Pokemon and organise them! Fantastic if you're on your quest to
		completing the Pokédex, or if you simply enjoy organising!
	</p>
{:else if $homepageMessaging === 'new-user'}
	<h1>What can you do with an account?</h1>
	<p>So what now?</p>
{:else}
	<h1>Pokécompanion</h1>
{/if}
<!-- <a href="/test">Test</a> -->
