<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import {
		Accordion,
		AccordionContent,
		AccordionItem,
		AccordionTrigger
	} from '$lib/components/ui/accordion';
	import { Separator } from '$lib/components/ui/separator';
	import { onMount } from 'svelte';
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import Shield from '@lucide/svelte/icons/shield';
	import Github from '@lucide/svelte/icons/github';
	import Sun from '@lucide/svelte/icons/sun';
	import Moon from '@lucide/svelte/icons/moon';
	import { toggleMode } from 'mode-watcher';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import Check from '@lucide/svelte/icons/check';

	// Function to handle login button click
	function handleLogin() {
		if (browser) {
			const REDDIT_CLIENT_ID = import.meta.env.VITE_REDDIT_CLIENT_ID;
			const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI;

			const state = Math.random().toString(36).substring(7); // Generate random state
			localStorage.setItem('oauth_state', state); // Store state for validation

			const scopes = ['mysubreddits', 'subscribe'].join(' ');
			const authUrl = `https://www.reddit.com/api/v1/authorize?client_id=${REDDIT_CLIENT_ID}&response_type=token&state=${state}&redirect_uri=${REDIRECT_URI}&duration=temporary&scope=${scopes}`;
			window.location.href = authUrl;
		}
	}
</script>

<svelte:head>
	<!-- Page-specific Meta Tags that override the default ones in layout -->
	<title>How to Unfollow Multiple Subreddits at Once - Reddit Guide</title>
	<meta name="title" content="How to Unfollow Multiple Subreddits at Once - Reddit Guide" />
	<meta
		name="description"
		content="Learn how to easily unfollow multiple Reddit subreddits at once. This comprehensive guide shows you how to clean up your Reddit feed and unsubscribe from unwanted subreddits quickly."
	/>
	<meta
		name="keywords"
		content="unfollow subreddits, unsubscribe reddit, clean reddit feed, mass unsubscribe reddit, reddit cleanup, how to unfollow subreddits, delete subreddits, remove subreddits"
	/>

	<!-- Open Graph / Facebook -->
	<meta property="og:title" content="How to Unfollow Multiple Subreddits at Once - Reddit Guide" />
	<meta
		property="og:description"
		content="Learn how to easily unfollow multiple Reddit subreddits at once. This comprehensive guide shows you how to clean up your Reddit feed and unsubscribe from unwanted subreddits quickly."
	/>
	<meta property="og:url" content="https://subcleaner.com/guide" />

	<!-- Twitter -->
	<meta
		property="twitter:title"
		content="How to Unfollow Multiple Subreddits at Once - Reddit Guide"
	/>
	<meta
		property="twitter:description"
		content="Learn how to easily unfollow multiple Reddit subreddits at once. This comprehensive guide shows you how to clean up your Reddit feed and unsubscribe from unwanted subreddits quickly."
	/>

	<link rel="canonical" href="https://subcleaner.com/guide" />
</svelte:head>

<div class="relative min-h-screen bg-gradient-to-b from-background to-secondary/20 text-foreground">
	<!-- Header/Navigation -->
	<header
		class="fixed top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md"
	>
		<div class="container mx-auto flex h-16 items-center justify-between px-4">
			<div class="flex items-center gap-2">
				<Shield class="h-6 w-6 text-orange-500" />
				<a href="/" class="text-xl font-bold">Sub Cleaner</a>
			</div>
			<div class="flex items-center gap-4">
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

	<!-- Main Content -->
	<main class="container mx-auto px-4 pb-16 pt-24">
		<section class="mx-auto max-w-4xl">
			<div class="mb-8">
				<h1 class="mb-4 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
					How to Unfollow Multiple Subreddits at Once
				</h1>
				<p class="text-xl text-muted-foreground">
					A comprehensive guide to cleaning up your Reddit feed and managing your subreddit
					subscriptions efficiently.
				</p>
			</div>

			<div class="prose prose-lg dark:prose-invert max-w-none">
				<h2 id="introduction">Why You Might Need to Unfollow Subreddits</h2>
				<p>
					Over time, many Reddit users find themselves subscribed to dozens or even hundreds of
					subreddits. This can lead to:
				</p>
				<ul>
					<li>An overwhelming and cluttered feed</li>
					<li>Content that's no longer relevant to your interests</li>
					<li>Difficulty finding posts from communities you actually care about</li>
					<li>Excessive notifications and distractions</li>
				</ul>
				<p>
					Cleaning up your subreddit subscriptions periodically can significantly improve your
					Reddit experience, but the native Reddit interface only allows you to unsubscribe from one
					subreddit at a time - a tedious process when you need to unfollow many.
				</p>

				<h2 id="methods">Methods to Unfollow Multiple Subreddits</h2>

				<h3 id="method-1">Method 1: Using Sub Cleaner (Fastest & Easiest)</h3>
				<p>
					<a href="/" class="text-orange-500 hover:underline">Sub Cleaner</a> is a free, secure web tool
					specifically designed to help you unsubscribe from multiple subreddits at once.
				</p>
				<h4>How to use Sub Cleaner:</h4>
				<ol>
					<li>
						<strong>Connect your Reddit account</strong> - Sub Cleaner uses Reddit's official OAuth2
						authentication, so your password is never shared.
					</li>
					<li>
						<strong>View all your subscribed subreddits</strong> - See a complete list with subscriber
						counts and descriptions.
					</li>
					<li>
						<strong>Select subreddits to unfollow</strong> - Choose individual subreddits or use the
						"Select All" option.
					</li>
					<li>
						<strong>Unsubscribe with one click</strong> - Remove all selected subreddits instantly.
					</li>
				</ol>
				<div class="my-8 flex justify-center">
					<Button onclick={handleLogin} class="bg-orange-500 hover:bg-orange-600">
						Try Sub Cleaner Now
						<ArrowRight class="ml-2 h-4 w-4" />
					</Button>
				</div>

				<div class="my-8 rounded-lg border border-border/50 bg-card/30 p-6">
					<h4 class="mb-2 flex items-center text-lg font-semibold">
						<Shield class="mr-2 h-5 w-5 text-orange-500" />
						Privacy & Security
					</h4>
					<ul class="space-y-2">
						<li class="flex items-start">
							<Check class="mr-2 mt-1 h-4 w-4 text-green-500" />
							<span>No Reddit credentials are stored</span>
						</li>
						<li class="flex items-start">
							<Check class="mr-2 mt-1 h-4 w-4 text-green-500" />
							<span>Secure OAuth2 authentication</span>
						</li>
						<li class="flex items-start">
							<Check class="mr-2 mt-1 h-4 w-4 text-green-500" />
							<span>Open source code available on GitHub</span>
						</li>
						<li class="flex items-start">
							<Check class="mr-2 mt-1 h-4 w-4 text-green-500" />
							<span
								>Minimal permissions requested (only what's needed to view and manage subscriptions)</span
							>
						</li>
					</ul>
				</div>

				<h3 id="method-2">Method 2: Using Reddit's Interface (Manual Method)</h3>
				<p>
					If you prefer to use Reddit's native interface, you can unsubscribe from subreddits one at
					a time:
				</p>
				<ol>
					<li>
						Go to <a
							href="https://www.reddit.com/subreddits/mine"
							target="_blank"
							rel="noopener noreferrer"
							class="text-orange-500 hover:underline">https://www.reddit.com/subreddits/mine</a
						>
					</li>
					<li>
						For each subreddit you want to unfollow:
						<ul>
							<li>Click on the "Joined" or "Leave" button</li>
							<li>Confirm your choice if prompted</li>
						</ul>
					</li>
				</ol>
				<p>
					<strong>Note:</strong> This method is time-consuming for large numbers of subreddits as you'll
					need to unsubscribe from each one individually.
				</p>

				<h3 id="method-3">Method 3: Using Reddit Enhancement Suite (RES)</h3>
				<p>Reddit Enhancement Suite is a browser extension that adds features to Reddit:</p>
				<ol>
					<li>
						Install <a
							href="https://redditenhancementsuite.com/"
							target="_blank"
							rel="noopener noreferrer"
							class="text-orange-500 hover:underline">Reddit Enhancement Suite</a
						>
					</li>
					<li>Go to your subreddits page</li>
					<li>Use RES features to navigate through subreddits more quickly</li>
					<li>You'll still need to unsubscribe from each subreddit individually</li>
				</ol>
				<p>
					<strong>Note:</strong> While RES improves the Reddit experience, it doesn't offer bulk unsubscribe
					functionality.
				</p>

				<h2 id="faq">Frequently Asked Questions</h2>

				<Accordion type="single" collapsible class="w-full">
					<AccordionItem value="item-1">
						<AccordionTrigger
							>Is it possible to recover subreddits after unsubscribing?</AccordionTrigger
						>
						<AccordionContent>
							<p>
								Once you've unsubscribed from a subreddit, you'll need to subscribe to it again
								manually. Sub Cleaner doesn't store your subscription history, so we recommend being
								certain before unsubscribing from subreddits.
							</p>
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="item-2">
						<AccordionTrigger>Is Sub Cleaner safe to use with my Reddit account?</AccordionTrigger>
						<AccordionContent>
							<p>
								Yes, Sub Cleaner is completely safe. It uses Reddit's official OAuth2 authentication
								system, which means:
							</p>
							<ul>
								<li>Your Reddit password is never shared with Sub Cleaner</li>
								<li>
									You authorize only the specific permissions needed (viewing and managing
									subscriptions)
								</li>
								<li>You can revoke access at any time through your Reddit account settings</li>
								<li>The code is open source and available for review on GitHub</li>
							</ul>
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="item-3">
						<AccordionTrigger>How many subreddits can I unsubscribe from at once?</AccordionTrigger>
						<AccordionContent>
							<p>
								With Sub Cleaner, you can unsubscribe from all your subreddits at once if you wish.
								There's no limit to how many you can select. However, due to Reddit's API rate
								limits, very large batches of unsubscribes may take a little time to process.
							</p>
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="item-4">
						<AccordionTrigger
							>Will unsubscribing from subreddits affect my Reddit account in any way?</AccordionTrigger
						>
						<AccordionContent>
							<p>
								Unsubscribing only removes the subreddits from your feed and subscription list. It
								doesn't affect:
							</p>
							<ul>
								<li>Your karma or account standing</li>
								<li>Your ability to view those subreddits in the future</li>
								<li>Your posts or comments in those subreddits</li>
								<li>Any moderator status you might have</li>
							</ul>
							<p>You can always resubscribe to any subreddit later if you change your mind.</p>
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="item-5">
						<AccordionTrigger>Why can't I see all my subreddits in the list?</AccordionTrigger>
						<AccordionContent>
							<p>
								Reddit's API has certain limitations that might affect the display of your
								subreddits:
							</p>
							<ul>
								<li>
									If you're subscribed to more than 1,000 subreddits, Reddit's API might not return
									all of them in a single request
								</li>
								<li>Private or quarantined subreddits might require additional permissions</li>
								<li>
									Recently subscribed subreddits might take a moment to appear in the API response
								</li>
							</ul>
							<p>
								If you're experiencing issues, try refreshing the page or logging out and back in.
							</p>
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="item-6">
						<AccordionTrigger
							>How often should I clean up my subreddit subscriptions?</AccordionTrigger
						>
						<AccordionContent>
							<p>
								This depends on your Reddit usage, but many users find benefits in reviewing their
								subscriptions:
							</p>
							<ul>
								<li><strong>Quarterly:</strong> For casual Reddit users</li>
								<li>
									<strong>Monthly:</strong> For active users who subscribe to new subreddits frequently
								</li>
								<li>
									<strong>As needed:</strong> When you notice your feed becoming cluttered or less relevant
								</li>
							</ul>
							<p>Regular cleanup helps maintain a more enjoyable and relevant Reddit experience.</p>
						</AccordionContent>
					</AccordionItem>
				</Accordion>

				<h2 id="benefits" class="mt-8">Benefits of Cleaning Up Your Subreddit Subscriptions</h2>
				<div class="grid gap-6 md:grid-cols-2">
					<div class="rounded-lg border border-border/50 bg-card/30 p-6">
						<h3 class="mb-2 text-xl font-semibold">Improved Feed Quality</h3>
						<p>
							By removing irrelevant subreddits, your feed will contain more content you actually
							care about.
						</p>
					</div>
					<div class="rounded-lg border border-border/50 bg-card/30 p-6">
						<h3 class="mb-2 text-xl font-semibold">Reduced Information Overload</h3>
						<p>
							Fewer subscriptions means less content to scroll through, making your Reddit
							experience less overwhelming.
						</p>
					</div>
					<div class="rounded-lg border border-border/50 bg-card/30 p-6">
						<h3 class="mb-2 text-xl font-semibold">Better Content Discovery</h3>
						<p>
							With a cleaner feed, you're more likely to notice posts from subreddits you truly
							enjoy.
						</p>
					</div>
					<div class="rounded-lg border border-border/50 bg-card/30 p-6">
						<h3 class="mb-2 text-xl font-semibold">More Focused Experience</h3>
						<p>
							Curating your subscriptions helps align your Reddit experience with your current
							interests.
						</p>
					</div>
				</div>

				<h2 id="conclusion" class="mt-8">Conclusion</h2>
				<p>
					Keeping your Reddit subscriptions organized is an important part of maintaining a positive
					social media experience. While Reddit's native interface makes bulk unsubscribing
					difficult, tools like Sub Cleaner provide a simple solution for efficiently managing your
					subreddit subscriptions.
				</p>
				<p>
					Whether you're looking to completely overhaul your feed or just remove a few unwanted
					subreddits, using a dedicated tool can save you significant time and effort.
				</p>

				<div class="my-8 flex justify-center">
					<Button onclick={handleLogin} class="bg-orange-500 hover:bg-orange-600">
						Clean Up My Reddit Feed Now
						<ArrowRight class="ml-2 h-4 w-4" />
					</Button>
				</div>
			</div>
		</section>
	</main>
</div>
