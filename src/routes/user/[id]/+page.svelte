<script lang="ts">
	const handleSignOut = async () => {
		console.log('sign out');
	};
</script>

<p>Hello signed in user</p>

<button on:click={handleSignOut}>Sign out</button>
