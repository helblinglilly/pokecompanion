<script>
	import Avatar from '$/components/Users/Avatar.svelte';
	import ChangeUsername from '$/components/Users/ChangeUsername.svelte';
	import DeleteUser from '$/components/Users/DeleteUser.svelte';
	import ReportUser from '$/components/Users/ReportUser.svelte';
	import { currentUser } from '$lib/stores/user';
	import Icon from '$/components/UI/Icon.svelte';
	import EmailVerification from '$/components/Auth/EmailVerification.svelte';
	import CreateNewTag from '$/ui/molecules/Collections/Tags/CreateNewTag/CreateNewTag.svelte';
	import CreateNewTeam from '$/ui/molecules/Collections/Teams/CreateNewTeam/CreateNewTeam.svelte';
	import { tagStore } from '$lib/stores/tags';
	import SocialPreview from '$/components/SocialPreview.svelte';
	import Card from '$/ui/atoms/card/Card.svelte';
	import ResetPassword from './ResetPassword.svelte';

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
		<div class="column md:max-w-[20rem]">
			<Card>
				<div class="grid justify-center h-fit mb-4">
					<div class="flex justify-center">
						<Avatar user={data.user} />
					</div>
					<div class="mt-4">
						{#if $currentUser && $currentUser.username === data.user.username}
							<ChangeUsername existingUsername={data.user.username} />
						{:else}
							<Card isNested classes="w-full inline-flex gap-4 justify-center">
								<h4 class="h4 text-center">{data.user.username}</h4>
							</Card>
							<div class="inline-flex justify-around w-full mt-4">
								<ReportUser username={data.user.username} />
							</div>
						{/if}
					</div>
				</div>

				<div class="hidden md:grid gap-4 justify-center mb-4">
					{#if $currentUser && $currentUser.username === data.user.username}
						<div>
							<h3 class="h3">Email verification</h3>
							<EmailVerification />
						</div>

						<div class="grid gap-4">
							<h2 class="h2">Danger Zone</h2>
							<ResetPassword />

							<DeleteUser user={$currentUser} />
						</div>
					{/if}
				</div>
			</Card>
		</div>

		<div class="column">
			<div class="grid lg:flex gap-8">
				<div class="">
					<Card>
						<div class="pb-2 inline-flex gap-8 justify-between w-full text-center ml-4 pr-8">
							<h2 class="h2 content-center">{data.user.username}'s teams</h2>
							{#if $currentUser}
								<CreateNewTeam />
							{/if}
						</div>

						<div class="grid gap-4 pt-2 m-4">
							{#each data.teams as team}
								<a href={`/user/${data.user.username}/teams/${team.id}`}>
									<Card isNested classes="inline-flex w-full">
										<div class="inline-flex">
											{#if team.isPrivate}
												<Icon
													style="margin-top: auto; margin-bottom: auto; padding-left: 0.25rem; padding-right: 0.25rem;"
													name="lock"
												/>
											{/if}

											<h4 class="h4">{team.name}</h4>
										</div>
									</Card>
								</a>
							{/each}
						</div>
					</Card>
				</div>

				<div class="">
					<Card>
						<div class="pb-2 inline-flex gap-8 justify-between w-full text-center ml-4 pr-8">
							<h2 class="h2 content-center">{data.user.username}'s tags</h2>
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
						<div class="grid gap-4 pt-2 m-4">
							{#each data.tags as tag}
								<a href={`/user/${data.user.username}/tags/${tag.id}`}>
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
											<i
												>({Object.keys(tag.contents).reduce((accumulator, current) => {
													// @ts-ignore can't tell compiler that current is a key of
													return accumulator + tag.contents[current].length;
												}, 0)} entries)</i
											>
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
			{#if $currentUser && $currentUser.username === data.user.username}
				<Card classes="grid gap-4">
					<div>
						<h3 class="h3">Email verification</h3>
						<EmailVerification />
					</div>

					<div class="grid gap-4">
						<h2 class="h2">Danger Zone</h2>

						<ResetPassword />

						<DeleteUser user={$currentUser} />
					</div>
				</Card>
			{/if}
		</div>
	</div>
</div>
