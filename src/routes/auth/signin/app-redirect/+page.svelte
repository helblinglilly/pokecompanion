<h1>TODO</h1>

<p>
	Need to change the auth redirect in general so that a ?redirectProtocol is accepted, which will
	either be for expo or the app Linking
</p>

<p>
	Then store that as a cookie. based on its presence, populate the redirectUri cookie when reaching
	out the the API, to redirect the user back to this page
</p>
<p>
	Then this page needs to read the cookie, and the auth token, and include the auth token as a query
	param before linking back to the app, so that the app can pick up the token from the URL
</p>
