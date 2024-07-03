<script>
	import { theme } from '$/lib/stores/domain';
	import { currentUser } from '$/lib/stores/user';
</script>

<a href="/pokemon" class="h-full">
	<button class="w-48 h-12 md:w-fit md:px-4">
		<p class="grid h-full align-center items-center">Pokémon</p>
	</button>
</a>

<a href="/settings" class="h-full">
	<button class="w-48 h-12 md:w-fit md:px-4">
		<p class="grid h-full align-center items-center">Settings</p>
	</button>
</a>

<a href="/about" class="h-full">
	<button class="w-48 h-12 md:w-fit md:px-4">
		<p class="grid h-full align-center items-center">About</p>
	</button>
</a>

{#if $currentUser}
	<a href={`/user/${$currentUser.username}`} class="h-full">
		<button class="w-48 h-12 md:w-fit md:px-4">
			<p class="grid h-full align-center items-center">Me - {$currentUser.username}</p>
		</button>
	</a>
{/if}

<a href={$currentUser ? '/auth/logout' : '/auth/signin'} class="h-full">
	<button class="w-48 h-12 md:w-fit md:px-4">
		<p class="grid h-full align-center items-center">Sign {$currentUser ? 'Out' : 'In'}</p>
	</button>
</a>

<button
	class="w-48 h-12 md:w-fit md:px-4"
	on:click={() => {
		if ($theme === 'light') {
			theme.set('dark');
		} else {
			theme.set('light');
		}
	}}><p class="grid h-full align-center items-center">Theme</p></button
>

<style>
	p {
		color: var(--light);
		width: 100%;
	}

	button {
		display: inline-flex;
	}

	button:hover {
		background-color: var(--dark);
	}
</style>
