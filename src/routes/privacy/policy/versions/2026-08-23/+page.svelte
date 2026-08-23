<script>
	import SocialPreview from '$/lib/components/SocialPreview.svelte';
</script>

<SocialPreview
	title="Privacy Policy"
	description="How Pokecompanion stores and handles user information"
/>
<div class="grid gap-4">
	<section>
		<h1 class="h1">Privacy Policy</h1>

		<i>Last updated: 23 August 2026</i>

		<p>
			This policy applies to pokecompanion.com, the Pokécompanion mobile application (the
			&quot;App&quot;), and any related website or service that links to this policy (together, the
			&quot;Services&quot;). It describes how and why we might collect, store, use and/or share
			(&quot;process&quot;) your information when you use the Services.
		</p>

		<p>
			<b>Questions or concerns?</b> Reading this privacy policy will help you understand your privacy
			rights and choices. If you do not agree with our policies and practices, please do not use our Services.
			If you still have any questions or concerns, please contact us at privacy@pokecompanion.com.
		</p>
	</section>

	<section>
		<section id="accountData">
			<h2 class="h2">What information do we collect?</h2>

			<p>We collect the following kinds of information.</p>

			<h3 class="h3">Account data</h3>
			<p>
				When you create or use an account on the website or in the App, we collect the following
				information, which we refer to as &quot;Account Data&quot;:
			</p>

			<ol>
				<li>Email address</li>
				<li>Username you set on our Services</li>
				<li>The password you set for your account</li>
				<li>
					Name of the third-party authentication provider you may have used to create an account
				</li>
			</ol>
		</section>

		<section id="websiteData">
			<h3 class="h3">Website data</h3>
			<p>
				As you interact with our website, we collect the following information for logging,
				performance and optimisation purposes:
			</p>

			<ol>
				<li>Information about your device and browser</li>
				<li>Location data based on your IP address, limited to country and city</li>
			</ol>
		</section>

		<section id="appData">
			<h3 class="h3">App data</h3>
			<p>
				When you use the App, we collect device and usage information, including device and
				operating system information, App version, screens viewed, feature interactions, technical
				diagnostics, and crash reports. If you are signed in, analytics may be associated with your
				account ID and username.
			</p>

			<p>
				The App also stores information on your device to provide its functionality, including your
				sign-in session, settings and language preferences, recent searches, onboarding progress,
				and cached content. Recent searches can be cleared from the App; signing out removes the
				stored sign-in session. You can remove the remaining locally stored App data by uninstalling
				the App.
			</p>
		</section>
	</section>

	<section>
		<section>
			<h2 class="h2">How long do we store information for?</h2>

			<p>
				<a href="#accountData">Account Data</a> is stored for as long as you have an account with us.
				When you delete your account, all account data is also deleted.
			</p>

			<p>
				<a href="#websiteData">Website data</a> is stored for 7 days and automatically deleted.
			</p>

			<p>
				<a href="#appData">App data</a> that is stored on your device remains there until you clear it,
				sign out where applicable, or uninstall the App. We retain App analytics, diagnostics and crash
				information only for as long as needed to operate, secure and improve the App.
			</p>
		</section>

		<section>
			<h2 class="h2" id="delete">How can you request deletion of your data?</h2>
			<p>
				<a href="#accountData">Account Data</a> will be deleted when you delete your account. To do so,
				sign in, visit the account settings page and request a deletion.
			</p>

			<p>
				To delete your website or App analytics data, or if you are not able to delete your account,
				please contact us via email at privacy@pokecompanion.com.
			</p>

			<p>
				We reserve the right to delete <a href="#accountData">Account Data</a> without notice in cases
				where we deem this to be appropriate or necessary.
			</p>
			<p>After you delete your account, website data may be retained for another 7 days.</p>
		</section>
	</section>

	<section>
		<h2 class="h2">Who do you share information with?</h2>

		<p>We do not sell your personal information.</p>

		<p>
			We use <a href="https://posthog.com/privacy">PostHog</a> for website and App analytics and
			error reporting, a self-hosted instance of <a href="https://umami.is/privacy">Umami</a> for
			website analytics, and
			<a href="https://www.newrelic.com/termsandconditions/privacy">New Relic</a>
			for App performance monitoring, diagnostics and crash reporting. These providers process the information
			described above on our behalf. Please refer to their respective privacy policies for more information.
		</p>
	</section>

	<section>
		<h2 class="h2">How do you process information?</h2>

		<p>
			We process <a href="#accountData">Account Data</a> to provide authentication and other core functionality
			of the Services.
		</p>

		<p>
			We process <a href="#websiteData">Website data</a> and <a href="#appData">App data</a> to operate,
			secure, understand and improve the Services, including identifying and fixing issues.
		</p>
	</section>

	<section>
		<h2 class="h2">Do you collect information from minors?</h2>

		<p>
			We do not knowingly collect or process information from anyone under the age of 18. By using
			our Services you confirm that you are at least 18 years old.
		</p>

		<p>
			If you become aware of any data we have collected from anybody under the age of 18, please
			contact us at privacy@pokecompanion.com.
		</p>
	</section>

	<section>
		<h2 class="h2">How can I exercise my rights?</h2>

		<p>
			To request access, corrections or deletion of any data we hold about you, please contact us at
			privacy@pokecompanion.com. We aim to complete requests within 7 days.
		</p>
	</section>

	<section>
		<h2 class="h2">Will this policy change?</h2>

		<p>Yes.</p>

		<p>
			The current version will be accessible at <a href="/privacy/policy">/privacy/policy</a>.
			Historic versions are accessible at
			<a href="/privacy/policy/versions">/privacy/policy/versions</a>.
		</p>
	</section>
</div>

<style>
	section {
		display: grid;
		gap: 1rem;
	}
</style>
