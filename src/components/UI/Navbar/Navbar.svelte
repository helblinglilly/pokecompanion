<script>
	import Links from './Links.svelte';

	$: isMobileMenuExpanded = false;
</script>

<nav class="flex w-full h-12 bg-navbar">
	<a href="/" class="h-full mr-2 w-full md:w-fit">
		<button class="pr-2 w-full">
			<div class="h-full">
				<img src="/favicon.png" alt="Site Icon" class="h-full p-2" />
			</div>
			<p class="grid h-full align-center items-center">Pokécompanion</p>
		</button>
	</a>

	<div class="hidden md:inline-flex">
		<Links />
	</div>

	<div
		class="md:hidden w-fit justify-end"
		id="navbar-hamburger"
		role="menu"
		tabindex="0"
		on:focusin={() => {
			isMobileMenuExpanded = true;
		}}
		on:focusout={() => {
			setTimeout(() => {
				const navbarHamburger = document.getElementById('navbar-hamburger');
				// Don't lose focus if a user is tabbing through the menus
				if (!navbarHamburger?.contains(document.activeElement)) {
					isMobileMenuExpanded = false;
				}
			}, 100);
		}}
	>
		<button class="w-full grid p-2 justify-end">
			<img
				src={`${isMobileMenuExpanded ? '/bag_open.png' : '/bag_closed.png'}`}
				alt={`${isMobileMenuExpanded ? 'Menus opened' : 'Menus closed'}`}
			/>
		</button>

		<div class={`z-20 bg-navbar relative w-fit gap-2 ${isMobileMenuExpanded ? 'grid' : 'hidden'}`}>
			<Links />
		</div>
	</div>
</nav>

<style>
	p {
		color: var(--light);
	}

	button {
		display: inline-flex;
		height: 100%;
	}

	button:hover {
		background-color: var(--branding-secondary);
	}
</style>
