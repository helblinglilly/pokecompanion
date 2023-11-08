<script>
	import PokemonPreview from '$components/Pokemon/PokemonPreview.svelte';
	import Avatar from '$components/Users/Avatar.svelte';
	import ChangePassword from '$components/Users/ChangePassword.svelte';
	import ChangeUsername from '$components/Users/ChangeUsername.svelte';
	import DeleteUser from '$components/Users/DeleteUser.svelte';
	import ReportUser from '$components/Users/ReportUser.svelte';
	import { currentUser } from '$lib/stores/user';
	import PokemonData from '$lib/data/pokemonNames.json';
	import Icon from '$components/Icon.svelte';

	export let data;
	console.log(data);
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
				<h2>Tag lists</h2>
				<div style="display: grid; gap: 1rem; padding-top: 0.5rem;">
					{#each data.tags as tag}
						<a href={`/user/${data.user.username}/tags/${tag.name}`}>
							<section
								style="background-color: var(--secondary); padding: 1rem; border-radius: 0.5rem;"
							>
								<div style="display: inline-flex; width: 100%; justify-content: space-between;">
									<div style="display: inline-flex;">
										{#if tag.isPrivate}
											<Icon
												style="margin-top: auto; margin-bottom: auto; padding-left: 0.25rem; padding-right: 0.25rem;"
												name="lock"
											/>
										{/if}
										<h4>{tag.name}</h4>
									</div>
									<p style="padding-left: 1rem;">
										<i>({tag.contents.pokemon.length} entries)</i>
									</p>
								</div>
							</section>
						</a>
					{/each}
				</div>
			</div>
		</div>
	</div>
	{#if $currentUser && $currentUser.username === data.user.username}
		<div class="card">
			<ChangePassword />
			<DeleteUser user={$currentUser} />
		</div>
	{/if}
</div>

<style>
	#sidebar {
		display: grid;
		justify-content: center;
		min-width: max-content;
	}

	#userWrapper > :not(:first-child) {
		margin-top: 2rem;
	}

	@media screen and (min-width: 768px) {
		#sidebar {
			max-width: 25%;
		}
	}

	section {
		box-shadow: 3px 12px 10px -10px rgba(0, 0, 0, 0.78);
		-webkit-box-shadow: 3px 12px 10px -10px rgba(0, 0, 0, 0.78);
		-moz-box-shadow: 3px 12px 10px -10px rgba(0, 0, 0, 0.78);
	}
</style>
