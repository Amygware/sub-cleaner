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
	import Sun from '@lucide/svelte/icons/sun';
	import Moon from '@lucide/svelte/icons/moon';
	import { toggleMode } from 'mode-watcher';
	import Shield from '@lucide/svelte/icons/shield';
	import Zap from '@lucide/svelte/icons/zap';
	import Lock from '@lucide/svelte/icons/lock';
	import Github from '@lucide/svelte/icons/github';

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

<div class="relative min-h-screen bg-gradient-to-b from-background to-secondary/20 text-foreground">
	<!-- Header/Navigation -->
	<header
		class="fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md"
	>
		<div class="container mx-auto flex h-16 items-center justify-between px-4">
			<div class="flex items-center gap-2">
				<Shield class="h-6 w-6 text-orange-500" />
				<span class="text-xl font-bold">Sub Cleaner</span>
			</div>
			<div class="flex items-center gap-4">
				<a
					href="/guide"
					class="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
				>
					<span>Guide</span>
				</a>
				<a
					href="https://github.com/amygware/sub-cleaner"
					target="_blank"
					rel="noopener noreferrer"
					class="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground"
				>
					<Github class="h-4 w-4" />
					<span class="hidden sm:inline">View on GitHub</span>
				</a>
				<Button onclick={toggleMode} variant="outline" size="icon" class="bg-secondary/20">
					<Sun
						class="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0"
					/>
					<Moon
						class="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100"
					/>
					<span class="sr-only">Toggle theme</span>
				</Button>
			</div>
		</div>
	</header>

	<!-- Hero Section -->
	<section
		class="relative z-10 flex min-h-screen w-full flex-col items-center justify-center px-4 pt-16 text-center"
		aria-labelledby="hero-heading"
	>
		<div
			class="align-center flex w-full max-w-7xl flex-col justify-around gap-12 md:flex-row md:items-center"
		>
			<div class="flex min-w-80 flex-col items-center justify-center md:items-start md:text-left">
				<div
					class="mb-4 inline-flex items-center rounded-full bg-orange-500/10 px-3 py-1 text-sm font-medium text-orange-500"
				>
					<Zap class="mr-1 h-3 w-3" /> Simple & Secure
				</div>
				<h1
					id="hero-heading"
					class="mb-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl lg:text-6xl"
				>
					Clean Up Your <span class="text-orange-500">Reddit Feed</span>
				</h1>
				<p class="mb-8 max-w-md text-lg text-muted-foreground">
					Unsubscribe from subreddits you no longer follow with ease. Take control of your Reddit
					experience in just a few clicks.
				</p>
				<div class="flex flex-col gap-4 sm:flex-row">
					<Button onclick={handleLogin} class="bg-orange-500 hover:bg-orange-600"
						>Clean up my reddit feed</Button
					>
					<div class="flex items-center text-sm text-muted-foreground">
						<Lock class="mr-2 h-4 w-4" /> Secure OAuth2 login
					</div>
				</div>
			</div>
			<div class="relative mt-8 md:mt-0">
				<div
					class="absolute -inset-1 rounded-xl bg-gradient-to-r from-orange-500 to-orange-300 opacity-30 blur-xl"
				></div>
				<Safari
					url="www.subcleaner.com/"
					width={1200}
					height={600}
					imageSrc={showcase}
					alt="Screenshot of the Sub Cleaner interface showing the subreddit management dashboard"
					class="relative rounded-xl shadow-2xl"
				/>
			</div>
		</div>
	</section>

	<!-- Trust Signals Section -->
	<section class="relative z-10 py-12">
		<div class="container mx-auto px-4">
			<div
				class="mx-auto max-w-3xl rounded-lg border border-border/50 bg-card/30 p-6 backdrop-blur-sm"
			>
				<div class="mb-6 flex flex-col items-center justify-center">
					<Lock class="mb-2 h-8 w-8 text-orange-500" />
					<h2 class="text-center text-2xl font-bold">Privacy & Security First</h2>
					<p class="mt-2 text-center text-muted-foreground">
						We take your privacy seriously. Here's how we keep your data safe:
					</p>
				</div>
				<div class="grid gap-6 md:grid-cols-3">
					<div class="flex flex-col items-center rounded-lg p-4 text-center">
						<div class="mb-3 rounded-full bg-orange-500/10 p-3">
							<Shield class="h-6 w-6 text-orange-500" />
						</div>
						<h3 class="mb-2 text-lg font-semibold">No Data Storage</h3>
						<p class="text-sm text-muted-foreground">
							We never store your Reddit credentials or personal information on our servers.
						</p>
					</div>
					<div class="flex flex-col items-center rounded-lg p-4 text-center">
						<div class="mb-3 rounded-full bg-orange-500/10 p-3">
							<Zap class="h-6 w-6 text-orange-500" />
						</div>
						<h3 class="mb-2 text-lg font-semibold">OAuth2 Authentication</h3>
						<p class="text-sm text-muted-foreground">
							We use Reddit's official OAuth2 flow for secure authentication without password
							access.
						</p>
					</div>
					<div class="flex flex-col items-center rounded-lg p-4 text-center">
						<div class="mb-3 rounded-full bg-orange-500/10 p-3">
							<Github class="h-6 w-6 text-orange-500" />
						</div>
						<h3 class="mb-2 text-lg font-semibold">Open Source</h3>
						<p class="text-sm text-muted-foreground">
							Our code is open source and available for review on GitHub for complete transparency.
						</p>
					</div>
				</div>
			</div>
		</div>
	</section>

	<!-- Features Section -->
	<section class="relative z-10 py-20" aria-labelledby="features-heading">
		<div class="container mx-auto px-4">
			<h2 id="features-heading" class="mb-4 text-center text-3xl font-bold">How It Works</h2>
			<p class="mx-auto mb-12 max-w-2xl text-center text-muted-foreground">
				Sub Cleaner makes it easy to manage your subreddit subscriptions in just a few simple steps.
			</p>
			<div class="grid gap-8 md:grid-cols-3">
				<article
					class="rounded-lg border border-border/50 bg-card/30 p-6 shadow-sm backdrop-blur-sm transition-all hover:shadow-md"
				>
					<div
						class="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/10 text-orange-500"
					>
						1
					</div>
					<h3 class="mb-4 text-xl font-semibold">Connect Your Account</h3>
					<p class="text-muted-foreground">
						Securely connect with your Reddit account using OAuth. We only request the minimum
						permissions needed.
					</p>
				</article>
				<article
					class="rounded-lg border border-border/50 bg-card/30 p-6 shadow-sm backdrop-blur-sm transition-all hover:shadow-md"
				>
					<div
						class="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/10 text-orange-500"
					>
						2
					</div>
					<h3 class="mb-4 text-xl font-semibold">Select Subreddits</h3>
					<p class="text-muted-foreground">
						Browse your subscriptions and select the subreddits you want to unsubscribe from with
						our intuitive interface.
					</p>
				</article>
				<article
					class="rounded-lg border border-border/50 bg-card/30 p-6 shadow-sm backdrop-blur-sm transition-all hover:shadow-md"
				>
					<div
						class="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-orange-500/10 text-orange-500"
					>
						3
					</div>
					<h3 class="mb-4 text-xl font-semibold">Clean Up Your Feed</h3>
					<p class="text-muted-foreground">
						With one click, unsubscribe from all selected subreddits and enjoy a cleaner, more
						relevant Reddit feed.
					</p>
				</article>
			</div>
		</div>
	</section>

	<!-- CTA Section -->
	<section class="relative z-10 py-20">
		<div class="container mx-auto px-4">
			<div
				class="mx-auto max-w-3xl rounded-xl bg-gradient-to-r from-orange-500/20 to-orange-300/20 p-8 text-center shadow-lg backdrop-blur-sm"
			>
				<h2 class="mb-4 text-3xl font-bold">Ready to Clean Up Your Reddit Feed?</h2>
				<p class="mb-8 text-muted-foreground">
					Join thousands of Reddit users who have simplified their feeds with Sub Cleaner.
				</p>
				<Button onclick={handleLogin} size="lg" class="bg-orange-500 hover:bg-orange-600">
					Get Started Now
				</Button>
			</div>
		</div>
	</section>

	<!-- Footer -->
	<footer class="border-t border-border/40 py-8">
		<div class="container mx-auto px-4">
			<div class="flex flex-col items-center justify-between gap-4 md:flex-row">
				<div class="flex items-center gap-2">
					<Shield class="h-5 w-5 text-orange-500" />
					<span class="font-semibold">Sub Cleaner</span>
				</div>
				<p class="text-sm text-muted-foreground">
					&copy; {new Date().getFullYear()} Sub Cleaner. Not affiliated with Reddit Inc.
				</p>
				<a
					href="https://amygware.com"
					class="link link-hover text-sm text-muted-foreground hover:text-foreground"
					target="_blank"
					rel="noopener noreferrer">Made by Amygware</a
				>
				<div class="flex gap-4">
					<a
						href="https://github.com/amygware/sub-cleaner"
						target="_blank"
						rel="noopener noreferrer"
						class="text-sm text-muted-foreground hover:text-foreground"
					>
						GitHub
					</a>
				</div>
			</div>
		</div>
	</footer>
</div>

{#if isLoading}
	<LoadingOverlay message="Connecting to Reddit..." />
{/if}
