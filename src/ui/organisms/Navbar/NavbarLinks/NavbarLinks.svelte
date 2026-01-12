<script>
	import { theme } from '$/lib/stores/domain';
	import { currentUser } from '$/lib/stores/user';
</script>

<a href="/pokedex" class="w-32 h-12 md:w-fit md:px-4 no-underline">
	<p class="grid h-full text-center items-center">Pokédex</p>
</a>

<a href="/settings" class="w-32 h-12 md:w-fit md:px-4 no-underline">
	<p class="grid h-full text-center items-center">Settings</p>
</a>

{#if $currentUser}
	<a href={`/user/${$currentUser.username}`} class="w-32 h-12 md:w-fit md:px-4 no-underline">
		<p class="grid h-full text-center items-center">Me - {$currentUser.username}</p>
	</a>
{/if}

<a
	href={$currentUser ? '/auth/logout' : '/auth/signin'}
	class="w-32 h-12 md:w-fit md:px-4 no-underline"
>
	<p class="grid h-full text-center items-center">Sign {$currentUser ? 'Out' : 'In'}</p>
</a>

<button
	class="w-32 h-12 md:w-fit md:px-4 md:ml-auto min-h-full"
	onclick={() => {
		if ($theme === 'light') {
			theme.set('dark');
		} else {
			theme.set('light');
		}
	}}><p class="grid h-full align-center items-center">Theme</p></button
>

<style>
	p {
		color: #edebeb;
		width: 100%;
	}

	a {
		display: inline-flex;
		background-color: var(--navbar-background);
		min-height: 100%;
	}

	a:hover,
	button:hover {
		background-color: var(--navbar-background);
	}
</style>
