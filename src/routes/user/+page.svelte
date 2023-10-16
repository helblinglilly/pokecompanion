<script lang="ts">
	import { page } from '$app/stores';
	import { pb } from '$lib/pocketbase';
	import { currentUser } from '$lib/stores/user';
	import Email from '../../components/Auth/Email.svelte';
	import Github from '../../components/Auth/Github.svelte';
	import Google from '../../components/Auth/Google.svelte';
	import type { IAuthProvider } from './+page';

	export let data: { oAuthMethods: IAuthProvider[] };
</script>

{#if $currentUser}
	<p>{JSON.stringify($page.data.session)}</p>
	<div class="columns">
		<div class="column">
			<p>{JSON.stringify($currentUser)}</p>
		</div>
	</div>
	<button
		on:click={() => {
			pb.authStore.clear();
			$currentUser = null;
		}}
		class="button">Sign out</button
	>
{:else}
	<div class="columns">
		<div class="column centered">
			<p>You are not signed in</p>
		</div>
	</div>

	{#each data.oAuthMethods as oAuthMethod}
		{#if oAuthMethod.name === 'google'}
			<div class="columns">
				<div class="column centered">
					<Google data={oAuthMethod} />
				</div>
			</div>
		{:else if oAuthMethod.name === 'github'}
			<div class="columns">
				<div class="column centered">
					<Github data={oAuthMethod} />
				</div>
			</div>
		{/if}
		<!-- <p>{JSON.stringify(oAuthMethod)}</p> -->
	{/each}

	<div class="columns">
		<div class="column centered">
			<Email />
		</div>
	</div>
{/if}
