<script>
	import NavbarLinks from './NavbarLinks';
	import Favicon from '$/ui/assets/favicon.png';
	import BagOpen from '$/ui/assets/bag_open.png';
	import BagClosed from '$/ui/assets/bag_closed.png';

	let isMobileMenuExpanded = $state(false);
</script>

<nav class="flex w-full h-12">
	<a href="/" class="h-full mr-2 w-full md:w-fit">
		<div class="w-full inline-flex h-full">
			<div class="h-full grid align-center">
				<img src={Favicon} alt="Site Icon" class="site-icon" />
			</div>
			<p class="grid h-full align-center items-center">Pokécompanion</p>
		</div>
	</a>

	<div class="hidden md:inline-flex w-full">
		<NavbarLinks />
	</div>

	<div
		class="md:hidden w-fit justify-end ml-auto relative"
		id="navbar-hamburger"
		role="menu"
		tabindex="0"
		onfocusin={() => {
			isMobileMenuExpanded = true;
		}}
		onfocusout={() => {
			setTimeout(() => {
				const navbarHamburger = document.getElementById('navbar-hamburger');
				// Don't lose focus if a user is tabbing through the menus
				if (!navbarHamburger?.contains(document.activeElement)) {
					isMobileMenuExpanded = false;
				}
			}, 100);
		}}
	>
		<button
			class="w-max grid p-2 justify-end z-20"
			onmousedown={() => {
				isMobileMenuExpanded = !isMobileMenuExpanded;
			}}
		>
			<img
				src={isMobileMenuExpanded ? BagOpen : BagClosed}
				alt={`${isMobileMenuExpanded ? 'Menus opened' : 'Menus closed'}`}
				class="h-8 w-full"
			/>
		</button>

		<div
			id="mobileNavbarLinks"
			class={`absolute right-0 top-12 z-10 w-fit gap-2 ${isMobileMenuExpanded ? 'grid' : 'hidden'}`}
		>
			<NavbarLinks />
		</div>
	</div>
</nav>

<style>
	nav {
		min-height: 5vh;
	}
	nav,
	#mobileNavbarLinks {
		background-color: var(--navbar-background);
	}

	p {
		color: #edebeb;
	}

	.site-icon {
		height: 3.5rem;
		max-width: fit-content;
		padding: 0.8rem 0.4rem 1rem 0.8rem;
	}

	button {
		display: inline-flex;
		height: 100%;
	}

	a:hover,
	button:hover {
		background-color: var(--navbar-background);
	}
</style>
