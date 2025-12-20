<script lang="ts">
	import Avatar from '$/lib/components/Users/Avatar.svelte';
	import ChangeUsername from '$/lib/components/Users/ChangeUsername.svelte';
	import DeleteUser from '$/lib/components/Users/DeleteUser.svelte';
	import ReportUser from '$/lib/components/Users/ReportUser.svelte';
	import { currentUser } from '$lib/stores/user';
	import Icon from '$/ui/atoms/icon/Icon.svelte';
	import EmailVerification from '$/routes/user/[username]/EmailVerification.svelte';
	import CreateNewTag from '$/ui/molecules/Collections/CreateNewTag.svelte';
	import SocialPreview from '$/lib/components/SocialPreview.svelte';
	import Card from '$/ui/atoms/card/Card.svelte';

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

				<div class="hidden md:grid gap-4 justify-center mb-4">
					{#if $currentUser && $currentUser.username === data.username}
						<div>
							<h3 class="h3">Email verification</h3>
							<EmailVerification />
						</div>

						<div class="grid gap-4">
							<h2 class="h2">Danger Zone</h2>
							<DeleteUser />
						</div>
					{/if}
				</div>
			</Card>
		</div>

		<div class="column">
			<div class="grid lg:flex gap-8">
				<div class="w-full">
					<Card>
						<div class="pb-2 inline-flex gap-8 justify-between w-full text-center ml-4 pr-8">
							<h2 class="h2 content-center">{data.username}'s tags</h2>
							{#if $currentUser}
								<CreateNewTag />
							{/if}
						</div>
						<div class="grid gap-4 pt-2 m-4">
							{#each data.tags as tag}
								<a href={`/user/${data.username}/tags/${tag.id}`}>
									<Card isNested classes="inline-flex w-full justify-between">
										<div class="inline-flex">
											{#if tag.isPrivate}
												<Icon
													style="margin-top: auto; margin-bottom: auto; padding-left: 0.25rem; padding-right: 0.25rem;"
													name="lock"
												/>
											{/if}
											<h4 class="h4">{tag.name}</h4>
										</div>
										<p style="padding-left: 1rem; min-width: fit-content;">
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

	<div class="columns md:hidden">
		<div class="column last:mb-4">
			{#if $currentUser && $currentUser.username === data.username}
				<Card classes="grid gap-4">
					<div>
						<h3 class="h3">Email verification</h3>
						<EmailVerification />
					</div>

					<div class="grid gap-4">
						<h2 class="h2">Danger Zone</h2>

						<DeleteUser />
					</div>
				</Card>
			{/if}
		</div>
	</div>
</div>
