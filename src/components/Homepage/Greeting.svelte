<script lang="ts">
	export let mode: 'new' | 'returning';
</script>

<h1>
	{#if mode === 'new'}
		Hi! Welcome to Pokécompanion
	{/if}
</h1>

{#if mode === 'new'}
	<p>Explore the world of the Pokémon video games without the information overload.</p>
	<p>Set your game and never get lost in the flood of information again!</p>
{/if}
