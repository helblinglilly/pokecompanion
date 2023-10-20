<script>
	import Avatar from '$components/Users/Avatar.svelte';

	export let data;
</script>

<div class="columns">
	<div class="column">
		<div class="card">
			<Avatar user={data.user} />
		</div>
	</div>
</div>
