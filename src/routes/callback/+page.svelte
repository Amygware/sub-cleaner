<script>
	import { onMount } from 'svelte';
	import LoadingOverlay from '$lib/components/LoadingOverlay.svelte';

	onMount(() => {
		const hash = window.location.hash.substring(1);
		const params = new URLSearchParams(hash);
		const accessToken = params.get('access_token');
		const state = params.get('state');
		const storedState = localStorage.getItem('oauth_state');

		if (accessToken && state === storedState) {
			localStorage.setItem('reddit_token', accessToken);
			window.location.href = '/unsubscribe'; // Redirect after successful login
		} else {
			console.error('OAuth2 state mismatch or missing access token.');
			window.location.href = '/'; // Go back to login
		}
	});
</script>
