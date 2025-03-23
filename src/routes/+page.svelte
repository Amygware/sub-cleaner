<script lang="ts">
	const REDDIT_CLIENT_ID = import.meta.env.VITE_REDDIT_CLIENT_ID;
	const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;
	let isLoading = false;
	import SnakeGame from '$lib/components/SnakeGame.svelte';
	import LoadingOverlay from '$lib/components/LoadingOverlay.svelte';
	import { browser } from '$app/environment';
	import { Button } from '$lib/components/ui/button';
	import { onMount } from 'svelte';
	import Safari from '$lib/components/Safari.svelte';
	import showcase from '$lib/showcase.png';
	import { track } from '@vercel/analytics';

	function handleLogin() {
		isLoading = true;
		track('login_clicked');
		const state = Math.random().toString(36).substring(7); // Generate random state
		localStorage.setItem('oauth_state', state); // Store state for validation

		const scopes = ['mysubreddits', 'subscribe'].join(' ');
		const authUrl = `https://www.reddit.com/api/v1/authorize?client_id=${REDDIT_CLIENT_ID}&response_type=token&state=${state}&redirect_uri=${REDIRECT_URI}&duration=temporary&scope=${scopes}`;
		window.location.href = authUrl;
	}

	let isDesktop = false;

	onMount(() => {
		if (browser) {
			isDesktop = window.innerWidth >= 768;
		}
	});
</script>

<div class="relative min-h-screen text-white">
	<!-- Hero Section -->
	<section
		class="relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-4 text-center"
	>
		<div class="align-center flex w-full max-w-7xl justify-around gap-8">
			<div class="flex flex-col items-center justify-center">
				<h1 class="mb-6 text-5xl font-bold tracking-tight sm:text-6xl">
					Clean Up Your Reddit Feed
				</h1>
				<p class="mb-8 text-xl text-gray-300">
					Unsubscribe from subreddits you no longer follow with ease. Take control of your Reddit
					experience.
				</p>
				<div class="flex justify-center gap-4">
					<Button onclick={handleLogin} class="bg-orange-500 hover:bg-orange-600"
						>Get Started</Button
					>
				</div>
			</div>
			<Safari url="super-sv.vercel.app" imageSrc={showcase} />
		</div>
	</section>

	<!-- Features Section -->
	<section class="relative z-10 py-20">
		<div class="container mx-auto px-4">
			<div class="grid gap-8 md:grid-cols-3">
				<div class="border-primary rounded-lg border p-6">
					<h3 class="mb-4 text-xl font-semibold">Easy to Use</h3>
					<p class="text-gray-300">
						Simple interface to manage your subreddit subscriptions. No complicated settings or
						confusing options.
					</p>
				</div>
				<div class="border-primary rounded-lg border p-6">
					<h3 class="mb-4 text-xl font-semibold">Quick & Efficient</h3>
					<p class="text-gray-300">
						Bulk unsubscribe from multiple subreddits at once. Save time and keep your feed clean.
					</p>
				</div>
				<div class="border-primary rounded-lg border p-6">
					<h3 class="mb-4 text-xl font-semibold">Secure</h3>
					<p class="text-gray-300">
						Your Reddit credentials are never stored. We only use them to help you manage your
						subscriptions.
					</p>
				</div>
			</div>
		</div>
	</section>
</div>

<div class="relative z-10 flex min-h-[80vh] items-center justify-center">
	<div class="border-primary w-full max-w-md rounded-lg border p-8 shadow-lg backdrop-blur-sm">
		<div class="text-center">
			<h1 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">Reddit Cleaner</h1>
			<p class="mb-8 text-gray-600 dark:text-gray-300">
				Easily unsubscribe from multiple subreddits at once
			</p>
			<button
				on:click={handleLogin}
				class="inline-flex items-center rounded-lg bg-orange-500 px-6 py-3 text-white transition hover:bg-orange-600"
				disabled={isLoading}
			>
				<svg class="mr-2 h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
					<path d="M12 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0z" />
					<path
						fill="white"
						d="M18.99 11.5c-.03-.3-.15-.6-.33-.8-.18-.2-.42-.37-.7-.44.01-.07 0-.15 0-.23 0-2.34-2.89-4.21-6.45-4.21-3.56 0-6.45 1.88-6.45 4.21 0 .08-.01.16 0 .23-.28.07-.52.24-.7.44-.18.2-.3.5-.33.8-.04.37.07.75.3 1.04.24.3.58.51.97.58.07.11.14.22.22.33 1.07 1.38 3.12 2.17 5.99 2.17s4.92-.79 5.99-2.17c.08-.11.15-.22.22-.33.39-.07.73-.28.97-.58.23-.29.34-.67.3-1.04zm-9.4 1.75c-.83-.48-.93-1.59-.22-2.31.7-.71 1.84-.82 2.34-.22.5.6.41 1.75-.29 2.46-.7.71-1.67.55-1.83.07zm4.82 0c-.16.48-1.13.64-1.83-.07-.7-.71-.79-1.86-.29-2.46.5-.6 1.64-.49 2.34.22.71.72.61 1.83-.22 2.31z"
					/>
				</svg>
				{isLoading ? 'Connecting...' : 'Connect with Reddit'}
			</button>
		</div>
	</div>
</div>

<!-- Snake Game Section (Desktop Only) -->
{#if isDesktop}
	<div class="relative h-[400px] w-full">
		<SnakeGame />
	</div>
{/if}

{#if isLoading}
	<LoadingOverlay message="Connecting to Reddit..." />
{/if}
