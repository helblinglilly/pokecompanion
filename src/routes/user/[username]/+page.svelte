<script lang="ts">
	import Avatar from '$/lib/components/Users/Avatar.svelte';
	import ChangeUsername from '$/lib/components/Users/ChangeUsername.svelte';
	import DeleteUser from '$/lib/components/Users/DeleteUser.svelte';
	import ReportUser from '$/lib/components/Users/ReportUser.svelte';
	import { currentUser } from '$lib/stores/user';
	import Icon from '$/ui/atoms/Icon.svelte';
	import EmailVerification from '$/routes/user/[username]/EmailVerification.svelte';
	import SocialPreview from '$/lib/components/SocialPreview.svelte';
	import Card from '$/ui/atoms/Card.svelte';
	import CreateNewTag from '$/features/tags/new/CreateNewTag.svelte';

	let { data } = $props();
</script>

<SocialPreview
	title={`${data.username}'s profile`}
	description={`This user has ${data.tags.length} tag collection${
		data.tags.length !== 1 ? 's' : ''
	}`}
/>

<div class="grid gap-8">
	<div class="columns gap-8">
		<div class="column md:max-w-[20rem]">
			<Card>
				<div class="grid justify-center h-fit mb-4">
					<div class="flex justify-center">
						<Avatar username={data.username} />
					</div>
					<div class="mt-4">
						{#if $currentUser && $currentUser.username === data.username}
							<ChangeUsername existingUsername={data.username} />
						{:else}
							<Card isNested classes="w-full inline-flex gap-4 justify-center">
								<h4 class="h4 text-center">{data.username}</h4>
							</Card>
							<div class="inline-flex justify-around w-full mt-4">
								<ReportUser username={data.username} />
							</div>
						{/if}
					</div>
				</div>

				{#if $currentUser && $currentUser.username === data.username}
					<div class="desktopOwnerOptions">
						<div>
							<h3 class="h3">Email verification</h3>
							<EmailVerification />
						</div>

						<div class="dangerZone">
							<h2 class="h2">Danger Zone</h2>
							<DeleteUser classes="w-full" />
						</div>
					</div>
				{/if}
			</Card>
		</div>

		<div class="column">
			<div class="grid lg:flex gap-8">
				<div class="w-full">
					<Card>
						<div class="pb-2 inline-flex gap-8 justify-between w-full text-center ml-4 pr-8">
							<h2 class="h2 content-center">{data.username}'s tags</h2>
							{#if $currentUser}
								<CreateNewTag contents={{ pokemon: [] }} />
							{/if}
						</div>
						<div class="grid gap-4 pt-2 m-4">
							{#each data.tags as tag}
								<a href={`/user/${data.username}/tags/${tag.id}`}>
									<Card isNested classes="inline-flex w-full justify-between">
										<div class="inline-flex">
											{#if tag.isPrivate}
												<span class="tag-lock"><Icon name="lock" /></span>
											{/if}
											<h4 class="h4">{tag.name}</h4>
										</div>
										<p class="tag-entry-count">
											<i>({tag.size} entries)</i>
										</p>
									</Card>
								</a>
							{/each}
						</div>
					</Card>
				</div>
			</div>
		</div>
	</div>

	<div class="mobileOwnerOptions">
		<div class="column last:mb-4">
			{#if $currentUser && $currentUser.username === data.username}
				<Card classes="grid gap-4">
					<div>
						<h3 class="h3">Email verification</h3>
						<EmailVerification />
					</div>

					<div class="grid gap-4">
						<h2 class="h2">Danger Zone</h2>
						<DeleteUser classes="w-full" />
					</div>
				</Card>
			{/if}
		</div>
	</div>
</div>

<style>
	.desktopOwnerOptions {
		display: grid;
		gap: 1rem;
		padding-top: 1rem;
		border-top: 1px solid var(--grey-muted);
	}

	.dangerZone {
		display: grid;
		gap: 1rem;
		padding-top: 1rem;
		border-top: 1px solid var(--grey-muted);
	}

	.mobileOwnerOptions {
		display: none;
	}

	.tag-lock {
		display: inline-flex;
		margin-top: auto;
		margin-bottom: auto;
		padding-right: var(--space-1);
		padding-left: var(--space-1);
	}

	.tag-entry-count {
		min-width: fit-content;
		padding-left: var(--space-3);
	}

	@media (max-width: 768px) {
		.desktopOwnerOptions {
			display: none;
		}

		.mobileOwnerOptions {
			display: flex;
			flex-direction: column;
		}
	}
</style>
