<script lang="ts">
	const REDDIT_CLIENT_ID = import.meta.env.VITE_REDDIT_CLIENT_ID;
	const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;

	function handleLogin() {
		const state = Math.random().toString(36).substring(7); // Generate random state
		localStorage.setItem('oauth_state', state); // Store state for validation

		const scopes = ['mysubreddits', 'subscribe'].join(' ');
		const authUrl = `https://www.reddit.com/api/v1/authorize?client_id=${REDDIT_CLIENT_ID}&response_type=token&state=${state}&redirect_uri=${REDIRECT_URI}&duration=temporary&scope=${scopes}`;
		window.location.href = authUrl;
	}
</script>

<div class="flex min-h-[80vh] items-center justify-center">
	<div class="w-full max-w-md rounded-lg bg-white p-8 shadow-lg dark:bg-gray-800">
		<div class="text-center">
			<h1 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Reddit Cleaner</h1>
			<p class="mb-8 text-gray-600 dark:text-gray-300">
				Easily unsubscribe from multiple subreddits at once
			</p>
			<button
				on:click={handleLogin}
				class="inline-flex items-center rounded-lg bg-orange-500 px-6 py-3 text-white transition hover:bg-orange-600"
			>
				<svg class="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
					<path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0z" />
					<path
						fill="white"
						d="M18.99 11.5c-.03-.3-.15-.6-.33-.8-.18-.2-.42-.37-.7-.44.01-.07 0-.15 0-.23 0-2.34-2.89-4.21-6.45-4.21-3.56 0-6.45 1.88-6.45 4.21 0 .08-.01.16 0 .23-.28.07-.52.24-.7.44-.18.2-.3.5-.33.8-.04.37.07.75.3 1.04.24.3.58.51.97.58.07.11.14.22.22.33 1.07 1.38 3.12 2.17 5.99 2.17s4.92-.79 5.99-2.17c.08-.11.15-.22.22-.33.39-.07.73-.28.97-.58.23-.29.34-.67.3-1.04zm-9.4 1.75c-.83-.48-.93-1.59-.22-2.31.7-.71 1.84-.82 2.34-.22.5.6.41 1.75-.29 2.46-.7.71-1.67.55-1.83.07zm4.82 0c-.16.48-1.13.64-1.83-.07-.7-.71-.79-1.86-.29-2.46.5-.6 1.64-.49 2.34.22.71.72.61 1.83-.22 2.31z"
					/>
				</svg>
				Connect with Reddit
			</button>
		</div>
	</div>
</div>
