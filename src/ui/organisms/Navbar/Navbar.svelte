<script>
	import NavbarLinks from './NavbarLinks';
	import Favicon from '$/ui/assets/favicon.png';
	import BagOpen from '$/ui/assets/bag_open.png';
	import BagClosed from '$/ui/assets/bag_closed.png';

	$: isMobileMenuExpanded = false;
</script>

<nav class="flex w-full h-12">
	<a href="/" class="h-full mr-2 w-full md:w-fit">
		<div class="pr-2 w-full inline-flex h-full">
			<div class="h-full">
				<img src={Favicon} alt="Site Icon" class="h-full p-2 min-w-fit" />
			</div>
			<p class="grid h-full align-center items-center">Pokécompanion</p>
		</div>
	</a>

	<div class="hidden md:inline-flex w-full">
		<NavbarLinks />
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
		<button
			class="w-full grid p-2 justify-end z-20"
			on:mousedown={() => {
				isMobileMenuExpanded = !isMobileMenuExpanded;
			}}
		>
			<img
				src={isMobileMenuExpanded ? BagOpen : BagClosed}
				alt={`${isMobileMenuExpanded ? 'Menus opened' : 'Menus closed'}`}
			/>
		</button>

		<div
			id="mobileNavbarLinks"
			class={`z-20 relative w-fit gap-2 ${isMobileMenuExpanded ? 'grid' : 'hidden'}`}
		>
			<NavbarLinks />
		</div>
	</div>
</nav>

<style>
	nav,
	#mobileNavbarLinks {
		background-color: #3d3938;
	}

	p {
		color: #edebeb;
	}

	button {
		display: inline-flex;
		height: 100%;
	}

	a:hover,
	button:hover {
		background-color: #3d3938;
	}
</style>
