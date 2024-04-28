<script>
	import SocialPreview from '$/components/SocialPreview.svelte';
</script>

<SocialPreview
	title="About"
	previewImage="https://socialpreviews.pokecompanion.helbling.uk/about.png"
/>

<div>
	<span>
		<img
			src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/201-question.png"
			alt="Questionmark Incognito"
		/>
		<h1 class="h1">About Pokécompanion</h1>
	</span>

	<hr />

	<section>
		<h2>Why Pokécompanion?</h2>
		<p>
			The world of Pokémon is gigantic. With a massive community, all sorts of spin-off games,
			movies, animes, creepypastas and so much more, there is huge amount of information present on
			the internet.
		</p>

		<p>
			As wonderful as that is, it makes finding even basic information like "at what level does this
			Pokémon evolve" hard to answer sometimes. This is where the Pokécompanion comes in.
		</p>

		<p>
			This website, and the way it displays content, has been focussed around the mainline Pokémon
			games from Generations 1 through 9. Selecting a specific game from the "Options" menu will
			narrow information down to just that specific game as good as possible.
		</p>

		<p>
			The idea is, that when you're sat down and need a specific bit of information, you should be
			able to find it here quickly with minimal effort and scrolling required.
		</p>

		<p>
			And finally, I grew up playing Pokémon games in German before emigrating to the UK and now
			playing them in English. So I wanted to add the ability to search in multiple languages. In
			the near future, languages other than English and German will be supported too.
		</p>
	</section>

	<section>
		<h2 class="h2">Legal</h2>
		<p>
			Neither this website, nor its creators or otherwise affiliated are associated with Nintendo.
			Pokémon and any associated contents displayed are trademarks of Nintendo.
		</p>
		<p>
			PokéAPI is licensed for use with a modified <a
				href="https://github.com/PokeAPI/pokeapi/blob/master/LICENSE.md">BSD-3 License</a
			>. This website is not associated with PokéAPI.
		</p>

		<p>
			This website is licensed under <a
				href="https://github.com/helblinglilly/pokecompanion/blob/main/LICENSE"
				>GNU General Public License v3.0.</a
			>
		</p>
	</section>
</div>

<style>
	@media screen and (min-width: 768px) {
		div {
			padding-left: 10%;
			padding-right: 10%;
		}
	}

	span {
		display: inline-flex;
		width: 100%;
	}
	span > h1 {
		text-align: center;
		padding-bottom: 0;
		margin-top: auto;
		margin-bottom: auto;
		gap: 2rem;
		min-width: fit-content;
	}

	@media screen and (max-width: 523px) {
		span {
			display: block;
		}

		img {
			margin-left: auto;
			margin-right: auto;
		}
	}

	section > p:not(:last-child) {
		margin-bottom: 1rem;
	}

	section:not(:first-child) {
		margin-top: 2rem;
	}

	hr {
		border-top-width: 0.2rem;
	}
</style>
