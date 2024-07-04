<script>
	import { theme } from '$/lib/stores/domain';
	import { currentUser } from '$/lib/stores/user';
</script>

<a href="/pokemon" class="w-48 h-12 md:w-fit md:px-4">
	<p class="grid h-full text-center items-center">Pokémon</p>
</a>

<a href="/settings" class="w-48 h-12 md:w-fit md:px-4">
	<p class="grid h-full text-center items-center">Settings</p>
</a>

<a href="/about" class="w-48 h-12 md:w-fit md:px-4">
	<p class="grid h-full text-center items-center">About</p>
</a>

{#if $currentUser}
	<a href={`/user/${$currentUser.username}`} class="w-48 h-12 md:w-fit md:px-4">
		<p class="grid h-full text-center items-center">Me - {$currentUser.username}</p>
	</a>
{/if}

<a href={$currentUser ? '/auth/logout' : '/auth/signin'} class="w-48 h-12 md:w-fit md:px-4">
	<p class="grid h-full text-center items-center">Sign {$currentUser ? 'Out' : 'In'}</p>
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

	a {
		display: inline-flex;
	}

	a:hover,
	button:hover {
		background-color: var(--dark);
	}
</style>
