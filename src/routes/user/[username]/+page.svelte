<script>
	import Avatar from '$components/Users/Avatar.svelte';
	import ChangePassword from '$components/Users/ChangePassword.svelte';
	import ChangeUsername from '$components/Users/ChangeUsername.svelte';
	import DeleteUser from '$components/Users/DeleteUser.svelte';
	import ReportUser from '$components/Users/ReportUser.svelte';
	import { currentUser } from '$lib/stores/user';

	export let data;
</script>

<div id="userWrapper">
	<div class="card">
		<div class="columns">
			<div class="column" id="sidebar">
				<div style="display: grid; justify-content: center;">
					<Avatar user={data.user} />
				</div>
				<div style="margin-top: 1rem;">
					{#if $currentUser && $currentUser.username === data.user.username}
						<ChangeUsername />
					{:else}
						<h4 style="text-align: center;">{data.user.username}</h4>
						<div style="display: inline-flex; justify-content: space-around; width: 100%;">
							<ReportUser username={data.user.username} style="padding: 5px;" />
							<!-- <button class="button secondary" style="padding: 5px;">Block</button> -->
						</div>
					{/if}
				</div>
			</div>

			<div class="column">
				<p>Main content</p>
			</div>
		</div>
	</div>
	{#if $currentUser && $currentUser.username === data.user.username}
		<div class="card">
			<ChangePassword />
			<DeleteUser />
		</div>
	{/if}
</div>

<style>
	#sidebar {
		display: grid;
		justify-content: center;
		border: 2px solid var(--secondary);
		border-radius: 5%;
	}

	#userWrapper > :not(:first-child) {
		margin-top: 2rem;
	}

	@media screen and (min-width: 768px) {
		#sidebar {
			max-width: 25%;
		}
	}
</style>
