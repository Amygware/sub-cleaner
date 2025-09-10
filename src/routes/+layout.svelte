<script lang="ts">
	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner';
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';
	import { ModeWatcher } from 'mode-watcher';
	import Shield from '@lucide/svelte/icons/shield';

	let { children } = $props();

	onMount(() => {
		inject({ mode: dev ? 'development' : 'production' });
	});
</script>

<svelte:head>
	<!-- Primary Meta Tags -->
	<title>Reddit Sub Cleaner - Clean Up Your Reddit Feed</title>
	<meta name="title" content="Reddit Sub Cleaner - Clean Up Your Reddit Feed" />
	<meta
		name="description"
		content="Easily unsubscribe from multiple subreddits at once. Take control of your Reddit experience with our simple, secure tool."
	/>
	<meta name="keywords" content="reddit, subreddit, unsubscribe, clean, feed, reddit cleaner" />
	<meta name="author" content="Sub Cleaner" />

	<!-- Open Graph / Facebook -->
	<meta property="og:type" content="website" />
	<meta property="og:url" content="https://subcleaner.com/" />
	<meta property="og:title" content="Reddit Sub Cleaner - Clean Up Your Reddit Feed" />
	<meta
		property="og:description"
		content="Easily unsubscribe from multiple subreddits at once. Take control of your Reddit experience with our simple, secure tool."
	/>
	<meta property="og:image" content="/og-image.png" />

	<!-- Twitter -->
	<meta property="twitter:card" content="summary_large_image" />
	<meta property="twitter:url" content="https://subcleaner.com/" />
	<meta property="twitter:title" content="Reddit Sub Cleaner - Clean Up Your Reddit Feed" />
	<meta
		property="twitter:description"
		content="Easily unsubscribe from multiple subreddits at once. Take control of your Reddit experience with our simple, secure tool."
	/>
	<meta property="twitter:image" content="/og-image.png" />

	<!-- Favicon -->
	<link rel="icon" href="/favicon.ico" />
	<link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
	<link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
	<link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />

	<!-- Structured Data (JSON-LD) -->
	<script type="application/ld+json">
		{
			"@context": "https://schema.org",
			"@type": "WebApplication",
			"name": "Reddit Sub Cleaner",
			"url": "https://subcleaner.com",
			"description": "Easily unsubscribe from multiple subreddits at once. Take control of your Reddit experience with our simple, secure tool.",
			"applicationCategory": "UtilityApplication",
			"offers": {
				"@type": "Offer",
				"price": "0",
				"priceCurrency": "USD"
			},
			"operatingSystem": "Web"
		}
	</script>
</svelte:head>

<ModeWatcher />

<div class="min-h-screen w-full bg-secondary" data-theme="light">
	<main class="w-full overflow-x-hidden">
		{@render children()}
	</main>
</div>

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

<Toaster closeButton />
