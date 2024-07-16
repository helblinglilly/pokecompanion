<script>
	import Avatar from '$/components/Users/Avatar.svelte';
	import ChangeUsername from '$/components/Users/ChangeUsername.svelte';
	import DeleteUser from '$/components/Users/DeleteUser.svelte';
	import ReportUser from '$/components/Users/ReportUser.svelte';
	import { currentUser } from '$lib/stores/user';
	import Icon from '$/components/UI/Icon.svelte';
	import EmailVerification from '$/components/Auth/EmailVerification.svelte';
	import { pb } from '$lib/stores/domain';
	import { addNotification } from '$lib/stores/notifications';
	import CreateNewTag from '$/components/Tags/CreateNewTag.svelte';
	import { tagStore } from '$lib/stores/tags';
	import SocialPreview from '$/components/SocialPreview.svelte';
	import { Logger } from '$lib/log';
	import Button from '$/ui/atoms/button/Button.svelte';
	import Card from '$/ui/atoms/card/Card.svelte';

	export let data;
</script>

<SocialPreview
	title={`${data.user.username}'s profile`}
	description={`This user has ${data.tags.length} tag collection${
		data.tags.length !== 1 ? 's' : ''
	}`}
/>

<div class="grid gap-8">
	<div class="columns gap-8">
		<div class="column">
			<Card>
				<div class="grid justify-center h-fit mb-4">
					<div class="flex justify-center">
						<Avatar user={data.user} />
					</div>
					<div class="mt-4">
						{#if $currentUser && $currentUser.username === data.user.username}
							<ChangeUsername />
						{:else}
							<h4 class="h4 text-center">{data.user.username}</h4>
							<div class="inline-flex justify-around w-full">
								<ReportUser username={data.user.username} style="padding: 5px;" />
								<!-- <button class="button secondary" style="padding: 5px;">Block</button> -->
							</div>
						{/if}
					</div>
				</div>
			</Card>
		</div>

		<div class="column">
			<Card>
				<div
					class="pb-2"
					style="display: inline-flex; gap: 2rem; justify-content: space-between; width: 100%; text-align: center;"
				>
					<h2 class="h2">{data.user.username}'s tags</h2>
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
								style="background-color: var(--grey-primary); padding: 1rem; border-radius: 0.5rem;"
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
			</Card>
		</div>
	</div>

	{#if $currentUser && $currentUser.username === data.user.username}
		<Card>
			<div class="columns mx-4 mb-4">
				<div class="column">
					<div style="padding-top: 1rem; padding-bottom: 1rem;">
						<h3 class="h3">Reset password</h3>
						<Button
							variant="primary"
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
									await Logger.error(Logger.ErrorClasses.UserOperation, Logger.buildError(err), {
										context: 'Failed to request password reset'
									});
								}
							}}
						>
							Request Reset
						</Button>
					</div>

					<div style="padding-top: 1rem; padding-bottom: 1rem;">
						<h3 class="h3">Email verification</h3>
						<EmailVerification />
					</div>

					<div style="padding-top: 1.5rem;">
						<h2 class="h2">Danger Zone</h2>
						<DeleteUser user={$currentUser} />
					</div>
				</div>
			</div>
		</Card>
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
