<script>
	import Avatar from '$components/Users/Avatar.svelte';
	import { currentUser } from '$lib/stores/user';

	export let data;
</script>

<div class="columns">
	<div class="column">
		<div class="card">
			<div class="columns">
				<div class="column" style="display: grid; justify-content: center;" id="sidebar">
					<div style="display: grid; justify-content: center;">
						<Avatar user={data.user} />
					</div>
					<div style="margin-top: 1rem;">
						{#if $currentUser && $currentUser.username === data.user.username}
							<div style="display: inline-flex; width: 100%;">
								<div style="display: flex;">
									<input
										type="text"
										style="height: 100%; max-width: 140px;"
										placeholder={$currentUser.username}
									/>
									<button
										class="button secondary"
										type="submit"
										id="updateUsernameButton"
										style="height: 100%;">Update</button
									>
								</div>
							</div>
						{:else}
							<h4 style="text-align: center;">{data.user.username}</h4>
						{/if}
					</div>
				</div>

				<div class="column">
					<p>Main content</p>
				</div>
			</div>
		</div>
	</div>
</div>

<style>
	#updateUsernameButton {
		border-top-left-radius: 0;
		border-bottom-left-radius: 0;
	}

	input[type='text'] {
		border-top-right-radius: 0;
		border-bottom-right-radius: 0;
		margin-right: 0;
		padding-right: 0;
	}

	@media screen and (min-width: 768px) {
		#sidebar {
			max-width: 300px;
		}
	}
</style>
