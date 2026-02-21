<script>
	import SocialPreview from '$/lib/components/SocialPreview.svelte';
	export const prerender = true;
</script>

<SocialPreview
	title="Privacy Policy"
	description="How Pokecompanion stores and handles user information"
/>
<div class="grid gap-4">
	<section>
		<h1 class="h1">Privacy Policy</h1>

		<i>Last updated: 14 July 2024</i>

		<p>
			This policy applies to pokecompanion.com ('we', 'us', or 'our') and describes how and why we
			might collect, store, use and/or share ('process') your information when you use our services
			('Services') such as when you:
		</p>

		<ol>
			<li>
				Visit our website at pokecompanion.com, or any website that links to this privacy notice
			</li>
		</ol>

		<p>
			<b>Questions or concerns?</b> Reading this privacy policy will help you understand your privacy
			rights and choices. If you do not agree with our policies and practices, please do not use our Services.
			If you still have any questions or concerns, please contact us at pokecompanion@helbling.uk.
		</p>
	</section>

	<section>
		<section id="accountData">
			<h2 class="h2">What information do we collect?</h2>

			<p>We collect two different kinds of information as outlined below.</p>

			<h3 class="h3">Account data</h3>
			<p>
				When you create an account on our site, we will collect the following information, which
				will be referred to as "Account Data":
			</p>

			<ol>
				<li>Email address</li>
				<li>Username you set on our site</li>
				<li>The password you set for your account</li>
				<li>
					Name of the 3rd party authentication provider you may have used to create an account
				</li>
			</ol>
		</section>

		<section id="browserData">
			<h3 class="h3">Browser Data</h3>
			<p>
				As you interact with our site, we will also collect the following information for logging,
				performance and optimisation purposes
			</p>

			<ol>
				<li>Information about your device and browser</li>
				<li>Location data based off your IP Address - Country and City</li>
			</ol>

			<p>If you do not wish for browser data to be collected, please stop using our site.</p>
		</section>
	</section>

	<section>
		<section>
			<h2 class="h2">How long do we store information for?</h2>

			<p>
				<a href="#accountData">Account Data</a> is stored for as long as you have an account with us.
				When you delete your account, all account data is also deleted.
			</p>

			<p><a href="#browserData">Browser Data</a> is stored for 7 days and automatically deleted.</p>
		</section>

		<section>
			<h2 class="h2">How can you request deletion of your data?</h2>
			<p>
				<a href="#accountData">Account Data</a> will be deleted when you delete your account. To do so,
				sign in, visit the account settings page and request a deletion.
			</p>

			<p>
				To delete your <a href="#accountData">Browser Data</a>, or if you are not able to delete
				your account with us, please contact us via Email at pokecompanion@helbling.uk
			</p>

			<p>
				We reserve the right to delete <a href="#accountData">Account Data</a> without notice in cases
				where we deem this to be appropriate or neccessary.
			</p>
		</section>
	</section>

	<section>
		<h2 class="h2">Who do you share information with?</h2>

		<p>Nobody.</p>

		<p>
			We use <a href="newrelic.com/privacy">NewRelic</a> and <a href="sentry.com/privacy">Sentry</a>
			to collect <a href="#browserData">Browser Data</a>. Please refer to their respective privacy
			policies for more information.
		</p>
	</section>

	<section>
		<h2 class="h2">How do you process information?</h2>

		<p>
			We may automatically process <a href="#accountData">Account Data</a> to faciliate core functionalities
			of the site like authentication.
		</p>

		<p>
			We may manually review <a href="#browserData">Browser Data</a> to identify and fix issues with our
			products.
		</p>
	</section>

	<section>
		<h2 class="h2">Do you collect information from minors?</h2>

		<p>
			We do not knowingly collect or process information from anyone under the age of 18. By using
			our products you confirm that you are at least 18 years old.
		</p>

		<p>
			If you become aware of any data we have collected of anybody under the age of 18, please
			contact us at pokecompanion@helbling.uk
		</p>
	</section>

	<section>
		<h2 class="h2">How can I exercise my rights?</h2>

		<p>
			To request access, corrections or deletions over any data we hold about you, please contact us
			at pokecompanion@helbling.uk and aim to complete this request within 7 days.
		</p>
	</section>

	<section>
		<h2 class="h2">Will this policy change?</h2>

		<p>Yes.</p>

		<p>
			The current version will be accessible at <a href="/privacy/policy">/privacy/policy</a>.
			Historic versions are accessible at
			<a href="/privacy/policy/versions">/privacy/policy/versions</a>
		</p>
	</section>
</div>

<style>
	section {
		display: grid;
		gap: 1rem;
	}
</style>
