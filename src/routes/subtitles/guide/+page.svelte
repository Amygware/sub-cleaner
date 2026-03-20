<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import {
		Accordion,
		AccordionContent,
		AccordionItem,
		AccordionTrigger
	} from '$lib/components/ui/accordion';
	import Shield from '@lucide/svelte/icons/shield';
	import Github from '@lucide/svelte/icons/github';
	import Sun from '@lucide/svelte/icons/sun';
	import Moon from '@lucide/svelte/icons/moon';
	import ArrowRight from '@lucide/svelte/icons/arrow-right';
	import { toggleMode } from 'mode-watcher';
</script>

<svelte:head>
	<title>How to Remove Ads from SRT Subtitle Files — Guide | SubCleaner</title>
	<meta name="title" content="How to Remove Ads from SRT Subtitle Files — Guide | SubCleaner" />
	<meta
		name="description"
		content="Learn how to remove ads, watermarks, and promotional text from SRT subtitle files. Guide covers online cleaning, Bazarr integration, and supported ad patterns."
	/>
	<meta
		name="keywords"
		content="remove ads from subtitles, srt ad remover guide, subtitle cleaner, bazarr subtitle cleaning, opensubtitles ads, subtitle watermark remover"
	/>

	<meta
		property="og:title"
		content="How to Remove Ads from SRT Subtitle Files — Guide | SubCleaner"
	/>
	<meta
		property="og:description"
		content="Learn how to remove ads, watermarks, and promotional text from SRT subtitle files."
	/>
	<meta property="og:url" content="https://subcleaner.com/subtitles/guide" />

	<meta
		property="twitter:title"
		content="How to Remove Ads from SRT Subtitle Files — Guide | SubCleaner"
	/>
	<meta
		property="twitter:description"
		content="Learn how to remove ads, watermarks, and promotional text from SRT subtitle files."
	/>

	<link rel="canonical" href="https://subcleaner.com/subtitles/guide" />
</svelte:head>

<div class="relative min-h-screen bg-gradient-to-b from-background to-secondary/20 text-foreground">
	<!-- Header -->
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
					How to Remove Ads from SRT Subtitle Files
				</h1>
				<p class="text-xl text-muted-foreground">
					A complete guide to cleaning up your subtitle files and removing unwanted ads, watermarks,
					and promotional content.
				</p>
			</div>

			<div class="prose prose-lg dark:prose-invert max-w-none">
				<h2 id="what-are-subtitle-ads">What Are Subtitle Ads?</h2>
				<p>
					Subtitle ads are promotional text blocks injected into SRT subtitle files by subtitle
					providers and sharing sites. They typically appear at the beginning or end of a video as
					on-screen text advertising the subtitle source, containing URLs, credits like "Subtitles
					by...", or calls to action like "Visit our website" or "Support us on Patreon". These ads
					are distracting and have no relation to the actual video content.
				</p>

				<h2 id="using-subcleaner">Using SubCleaner Online</h2>
				<p>
					The fastest way to remove ads from your subtitle files is with our free
					<a href="/subtitles" class="text-orange-500 hover:underline">SRT Subtitle Ad Remover</a>.
					It runs entirely in your browser — no files are uploaded to any server.
				</p>
				<ol>
					<li>
						<strong>Upload or paste</strong> your .srt file into the tool
					</li>
					<li>
						<strong>Click "Clean Subtitles"</strong> — the tool scans every subtitle block for ad patterns
					</li>
					<li>
						<strong>Review the diff</strong> — removed blocks are highlighted in red so you can verify
						what was cleaned
					</li>
					<li>
						<strong>Download or copy</strong> the cleaned file
					</li>
				</ol>
				<div class="my-8 flex justify-center">
					<Button href="/subtitles" class="bg-orange-500 hover:bg-orange-600">
						Try the Subtitle Cleaner
						<ArrowRight class="ml-2 h-4 w-4" />
					</Button>
				</div>

				<h2 id="bazarr-integration">Using with Bazarr</h2>
				<p>
					If you use <strong>Bazarr</strong> to automatically download subtitles for your Plex, Jellyfin,
					or Emby media server, you can clean subtitles as a post-processing step:
				</p>
				<ol>
					<li>Download subtitles normally through Bazarr</li>
					<li>
						Use SubCleaner to clean the downloaded .srt files before they are picked up by your
						media server
					</li>
					<li>
						For automation, consider using the
						<a
							href="https://github.com/KBlixt/subcleaner"
							target="_blank"
							rel="noopener noreferrer"
							class="text-orange-500 hover:underline">subcleaner CLI tool</a
						> as a Bazarr post-processing script
					</li>
				</ol>
				<p>
					This ensures your subtitles are always ad-free without manual intervention for each file.
				</p>

				<h2 id="supported-patterns">Supported Ad Patterns</h2>
				<p>
					SubCleaner detects and removes subtitle blocks that contain the following types of
					content:
				</p>
				<ul>
					<li>
						<strong>URLs and domains</strong> — links starting with http://, https://, www., or containing
						common TLDs (.com, .net, .org, .io)
					</li>
					<li>
						<strong>Credit watermarks</strong> — "Subtitles by", "Encoded by", "Synced by", "Translated
						by", "Corrected by", "Captioned by", "Ripped by"
					</li>
					<li>
						<strong>Source attributions</strong> — "Downloaded from", references to OpenSubtitles, Addic7ed,
						Subscene
					</li>
					<li>
						<strong>Promotional text</strong> — "Visit our", "Support us", "Donate", "Patreon"
					</li>
				</ul>
				<p>
					A subtitle block is only removed when <strong>all</strong> of its non-empty text lines match
					at least one ad pattern. If a block contains a mix of real dialogue and ad text, it is preserved
					to avoid removing actual subtitle content.
				</p>

				<h2 id="faq">Frequently Asked Questions</h2>

				<Accordion type="single" collapsible class="w-full">
					<AccordionItem value="item-1">
						<AccordionTrigger>Is my file uploaded to a server?</AccordionTrigger>
						<AccordionContent>
							<p>
								No. SubCleaner's subtitle tool runs entirely in your web browser using JavaScript.
								Your subtitle files are never sent to any server — all processing happens locally on
								your device. You can even use the tool offline after the page has loaded.
							</p>
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="item-2">
						<AccordionTrigger>Does it work with non-English subtitles?</AccordionTrigger>
						<AccordionContent>
							<p>
								Yes. The ad detection patterns target English-language promotional phrases and URLs,
								which are used by subtitle providers regardless of the subtitle language. Ads
								injected by sites like OpenSubtitles or Addic7ed are almost always in English even
								in non-English subtitle files, so the cleaner works effectively across all
								languages.
							</p>
						</AccordionContent>
					</AccordionItem>

					<AccordionItem value="item-3">
						<AccordionTrigger>Can I automate this?</AccordionTrigger>
						<AccordionContent>
							<p>
								For automated workflows, we recommend using the open-source
								<a
									href="https://github.com/KBlixt/subcleaner"
									target="_blank"
									rel="noopener noreferrer"
									class="text-orange-500 hover:underline">subcleaner CLI tool</a
								>, which can be configured as a Bazarr post-processing script. This allows every
								subtitle downloaded by Bazarr to be automatically cleaned before your media server
								picks it up.
							</p>
						</AccordionContent>
					</AccordionItem>
				</Accordion>

				<h2 id="conclusion" class="mt-8">Conclusion</h2>
				<p>
					Subtitle ads are a common nuisance for media server users. Whether you're cleaning a
					single file or processing subtitles in bulk, SubCleaner makes it easy to remove unwanted
					promotional content while preserving the actual subtitle text.
				</p>

				<div class="my-8 flex justify-center">
					<Button href="/subtitles" class="bg-orange-500 hover:bg-orange-600">
						Clean My Subtitles Now
						<ArrowRight class="ml-2 h-4 w-4" />
					</Button>
				</div>
			</div>
		</section>
	</main>
</div>
