<script>
	import Avatar from '$components/Users/Avatar.svelte';
	import ChangeUsername from '$components/Users/ChangeUsername.svelte';
	import DeleteUser from '$components/Users/DeleteUser.svelte';
	import ReportUser from '$components/Users/ReportUser.svelte';
	import { currentUser } from '$lib/stores/user';
	import Icon from '$components/UI/Icon.svelte';
	import EmailVerification from '$components/Auth/EmailVerification.svelte';
	import { pb } from '$lib/stores/domain';
	import { error } from '$lib/log';
	import { addNotification } from '$lib/stores/notifications';
	import CreateNewTag from '$components/Tags/CreateNewTag.svelte';
	import { tagStore } from '$lib/stores/tags';
	import SocialPreview from '$components/SocialPreview.svelte';

	export let data;
</script>

<SocialPreview
	title={`${data.user.username}'s profile`}
	description={`This user has ${data.tags.length} tag collection${
		data.tags.length !== 1 ? 's' : ''
	}`}
/>

<div id="userWrapper">
	<div class="card">
		<div class="columns">
			<div class="column" id="sidebar">
				<div style="display: grid; justify-content: center; height: fit-content;">
					<div style="display: flex; justify-content: center;">
						<Avatar user={data.user} />
					</div>
					<div style="margin-top: 1rem;">
						{#if $currentUser && $currentUser.username === data.user.username}
							<ChangeUsername />
						{:else}
							<h4 class="h4" style="text-align: center;">{data.user.username}</h4>
							<div style="display: inline-flex; justify-content: space-around; width: 100%;">
								<ReportUser username={data.user.username} style="padding: 5px;" />
								<!-- <button class="button secondary" style="padding: 5px;">Block</button> -->
							</div>
						{/if}
					</div>
				</div>
			</div>

			<div class="column">
				<div
					style="display: inline-flex; gap: 2rem; justify-content: space-between; width: 100%; text-align: center;"
				>
					<h2 class="h2" style="padding-bottom: 0;">Tag lists</h2>
					{#if $currentUser}
						<CreateNewTag
							userId={$currentUser.id}
							initialContent={{}}
							onSuccess={() => {
								// @ts-ignore Just missing creation/updated timestamps
								data.tags = $tagStore;
							}}
						/>
					{/if}
				</div>
				<div id="taglist">
					{#each data.tags as tag}
						<a href={`/user/${data.user.username}/tags/${tag.id}`}>
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
										<h4 class="h4">{tag.name}</h4>
									</div>
									<p style="padding-left: 1rem; min-width: fit-content;">
										<i
											>({Object.keys(tag.contents).reduce((accumulator, current) => {
												// @ts-ignore can't tell compiler that current is a key of
												return accumulator + tag.contents[current].length;
											}, 0)} entries)</i
										>
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
		<div class="card" style="justify-content: center;">
			<div class="columns">
				<div class="column">
					<div style="padding-top: 1rem; padding-bottom: 1rem;">
						<h3 class="h3">Reset password</h3>
						<button
							class="button secondary"
							on:click={async () => {
								if (!$currentUser) {
									return;
								}
								try {
									await $pb.collection('users').requestPasswordReset($currentUser.email);
									addNotification({
										message: 'You have requested a password reset',
										level: 'info'
									});
								} catch (err) {
									addNotification({
										message: 'Failed to request password reset. Please try again',
										level: 'failure'
									});
									error(
										'Failed to request password reset',
										'FailedToRequestPasswordReset',
										JSON.stringify(err)
									);
								}
							}}>Request reset</button
						>
					</div>

					<hr />

					<div style="padding-top: 1rem; padding-bottom: 1rem;">
						<h3 class="h3">Email verification</h3>
						<EmailVerification />
					</div>

					<hr />

					<div style="padding-top: 1.5rem;">
						<h2 class="h2">Danger Zone</h2>
						<DeleteUser user={$currentUser} />
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

<style>
	#sidebar {
		display: grid;
		justify-content: center;
	}

	#taglist {
		display: grid;
		gap: 1rem;
		padding-top: 0.5rem;
	}

	#userWrapper > :not(:first-child) {
		margin-top: 2rem;
	}

	@media screen and (min-width: 768px) {
		#sidebar {
			max-width: 35%;
		}

		#taglist {
			max-width: 600px;
		}
	}
</style>
