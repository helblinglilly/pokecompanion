<footer>
	<div class="columns md:gap-2">
		<div class="column grid justify-center md:block md:text-left" style="padding: 0;">
			<div class="w-full text-center">
				<a href="/about">About</a>
			</div>
			<div class="w-full text-center">
				<a href="/privacy/policy">Privacy Policy</a>
			</div>
		</div>
		<div class="column grid text-center" style="padding: 0;">
			<div class="inline-flex text-center justify-center">
				<p>Powered by</p>
				&nbsp;
				<a href="https://pokeapi.co" class="underline">PokéAPI</a>
			</div>

			<div class="inline-grid lg:inline-flex text-center justify-center">
				<p class="hidden lg:block" style="text-wrap: nowrap;">Built at</p>
				<p class="hidden lg:block">&nbsp</p>
				<a href="https://github.com/helblinglilly/pokecompanion" class="underline"
					>github.com/helblinglilly/pokecompanion</a
				>
			</div>
			<a href="https://ko-fi.com/X8X710K2JH" target="_blank" class="grid justify-center p-2"
				><img
					style="border:0px;height:24px;"
					src="/kofi_button_red.png"
					alt="Buy Me a Coffee at ko-fi.com"
				/></a
			>
		</div>

		<div id="disclaimer" class="column">
			<p>Pokémon and Pokémon character names are trademarks of Nintendo.</p>
			<p>This site is not associated with Nintendo, Gamefreak, The Pokémon Company or PokéAPI</p>
		</div>
	</div>
</footer>

<style>
	footer {
		display: grid;
		/* text-align: center; */
		background-color: #3d3938d2;
		position: relative;
		bottom: 0;
		min-height: 12vh;
		padding: 1vh;
	}

	p,
	a {
		color: #bfbcbc;
		font-size: smaller;
	}

	@media screen and (max-width: 768px) {
		#disclaimer {
			padding-top: 2rem;
		}
	}
</style>
