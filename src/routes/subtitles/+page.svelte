<script lang="ts">
	import { Button } from '$lib/components/ui/button';
	import { cleanSrt, type CleanResult } from '$lib/srt';
	import { cn } from '$lib/utils';
	import Shield from '@lucide/svelte/icons/shield';
	import Github from '@lucide/svelte/icons/github';
	import Sun from '@lucide/svelte/icons/sun';
	import Moon from '@lucide/svelte/icons/moon';
	import Upload from '@lucide/svelte/icons/upload';
	import Download from '@lucide/svelte/icons/download';
	import Copy from '@lucide/svelte/icons/copy';
	import FileText from '@lucide/svelte/icons/file-text';
	import Check from '@lucide/svelte/icons/check';
	import { toggleMode } from 'mode-watcher';
	import { browser } from '$app/environment';

	let inputMode: 'upload' | 'paste' = $state('upload');
	let rawText = $state('');
	let fileName = $state('');
	let result: CleanResult | null = $state(null);
	let showCleanOnly = $state(false);
	let copied = $state(false);
	let dragOver = $state(false);

	function handleFile(file: File) {
		if (!file.name.toLowerCase().endsWith('.srt')) return;
		fileName = file.name;
		const reader = new FileReader();
		reader.onload = (e) => {
			rawText = (e.target?.result as string) ?? '';
		};
		reader.readAsText(file);
	}

	function handleFileInput(e: Event) {
		const input = e.target as HTMLInputElement;
		const file = input.files?.[0];
		if (file) handleFile(file);
	}

	function handleDrop(e: DragEvent) {
		e.preventDefault();
		dragOver = false;
		const file = e.dataTransfer?.files?.[0];
		if (file) handleFile(file);
	}

	function handleDragOver(e: DragEvent) {
		e.preventDefault();
		dragOver = true;
	}

	function handleDragLeave() {
		dragOver = false;
	}

	function clean() {
		if (!rawText.trim()) return;
		result = cleanSrt(rawText);
	}

	function downloadCleaned() {
		if (!result) return;
		const blob = new Blob([result.cleaned], { type: 'text/plain;charset=utf-8' });
		const url = URL.createObjectURL(blob);
		const a = document.createElement('a');
		const baseName = fileName ? fileName.replace(/\.srt$/i, '') : 'subtitles';
		a.href = url;
		a.download = `${baseName}-cleaned.srt`;
		a.click();
		URL.revokeObjectURL(url);
	}

	async function copyToClipboard() {
		if (!result || !browser) return;
		await navigator.clipboard.writeText(result.cleaned);
		copied = true;
		setTimeout(() => (copied = false), 2000);
	}

	function reset() {
		result = null;
		rawText = '';
		fileName = '';
		showCleanOnly = false;
	}
</script>

<svelte:head>
	<title>Subtitle Cleaner — Remove Ads from SRT Files Online | SubCleaner</title>
	<meta name="title" content="Subtitle Cleaner — Remove Ads from SRT Files Online | SubCleaner" />
	<meta
		name="description"
		content="Free online tool to remove ads, watermarks, and promotional text from SRT subtitle files. Works entirely in your browser — no uploads, no servers. Perfect for Plex, Jellyfin, Emby, and Bazarr users."
	/>
	<meta
		name="keywords"
		content="srt ad remover, subtitle cleaner online, remove ads from subtitles, srt cleaner, subtitle ad remover, plex subtitles, jellyfin subtitles, bazarr subtitle cleaner, opensubtitles ad remover"
	/>

	<meta
		property="og:title"
		content="Subtitle Cleaner — Remove Ads from SRT Files Online | SubCleaner"
	/>
	<meta
		property="og:description"
		content="Free online tool to remove ads, watermarks, and promotional text from SRT subtitle files. Works entirely in your browser."
	/>
	<meta property="og:url" content="https://subcleaner.com/subtitles" />
	<meta property="og:type" content="website" />

	<meta
		property="twitter:title"
		content="Subtitle Cleaner — Remove Ads from SRT Files Online | SubCleaner"
	/>
	<meta
		property="twitter:description"
		content="Free online tool to remove ads, watermarks, and promotional text from SRT subtitle files. Works entirely in your browser."
	/>
	<meta property="twitter:card" content="summary_large_image" />

	<link rel="canonical" href="https://subcleaner.com/subtitles" />
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
			<!-- Hero -->
			<div class="mb-10 text-center">
				<div class="mb-4 flex items-center justify-center gap-3">
					<FileText class="h-10 w-10 text-orange-500" />
					<h1 class="text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
						SRT Subtitle Ad Remover
					</h1>
				</div>
				<p class="mx-auto max-w-2xl text-lg text-muted-foreground">
					Remove ads, watermarks, and promotional text from SRT subtitle files. Runs entirely in
					your browser — your files never leave your device.
				</p>
			</div>

			{#if !result}
				<!-- Input Section -->
				<div class="rounded-xl border border-border/50 bg-card/50 p-6">
					<!-- Mode Toggle -->
					<div class="mb-6 flex gap-2">
						<Button
							variant={inputMode === 'upload' ? 'default' : 'outline'}
							onclick={() => (inputMode = 'upload')}
							class={inputMode === 'upload' ? 'bg-orange-500 hover:bg-orange-600' : ''}
						>
							<Upload class="mr-2 h-4 w-4" />
							Upload File
						</Button>
						<Button
							variant={inputMode === 'paste' ? 'default' : 'outline'}
							onclick={() => (inputMode = 'paste')}
							class={inputMode === 'paste' ? 'bg-orange-500 hover:bg-orange-600' : ''}
						>
							<FileText class="mr-2 h-4 w-4" />
							Paste Text
						</Button>
					</div>

					{#if inputMode === 'upload'}
						<!-- File Upload / Dropzone -->
						<label
							class={cn(
								'flex cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-12 transition-colors',
								dragOver
									? 'border-orange-500 bg-orange-500/5'
									: 'border-border hover:border-orange-500/50'
							)}
							ondrop={handleDrop}
							ondragover={handleDragOver}
							ondragleave={handleDragLeave}
						>
							<Upload class="mb-3 h-10 w-10 text-muted-foreground" />
							{#if fileName}
								<p class="text-lg font-medium text-foreground">{fileName}</p>
								<p class="mt-1 text-sm text-muted-foreground">File loaded. Click below to clean.</p>
							{:else}
								<p class="text-lg font-medium text-foreground">
									Drop your .srt file here or click to browse
								</p>
								<p class="mt-1 text-sm text-muted-foreground">Only .srt files are supported</p>
							{/if}
							<input type="file" accept=".srt" class="hidden" onchange={handleFileInput} />
						</label>
					{:else}
						<!-- Paste Textarea -->
						<textarea
							bind:value={rawText}
							placeholder="Paste your SRT subtitle content here..."
							class="min-h-[300px] w-full rounded-lg border border-border bg-background p-4 font-mono text-sm text-foreground placeholder:text-muted-foreground focus:border-orange-500 focus:outline-none focus:ring-1 focus:ring-orange-500"
						></textarea>
					{/if}

					<!-- Clean Button -->
					<div class="mt-6 flex justify-center">
						<Button
							onclick={clean}
							disabled={!rawText.trim()}
							class="bg-orange-500 px-8 py-3 text-lg hover:bg-orange-600"
						>
							<Shield class="mr-2 h-5 w-5" />
							Clean Subtitles
						</Button>
					</div>
				</div>
			{:else}
				<!-- Results Section -->
				<div class="space-y-6">
					<!-- Stats -->
					<div class="rounded-xl border border-border/50 bg-card/50 p-6">
						<div class="flex flex-wrap items-center justify-between gap-4">
							<div>
								<h2 class="text-2xl font-bold text-foreground">Cleaning Complete</h2>
								<p class="mt-1 text-muted-foreground">
									Removed <span class="font-semibold text-orange-500">{result.removedCount}</span>
									of
									<span class="font-semibold">{result.originalCount}</span> subtitle blocks
								</p>
							</div>
							<div class="flex gap-2">
								<Button onclick={downloadCleaned} class="bg-orange-500 hover:bg-orange-600">
									<Download class="mr-2 h-4 w-4" />
									Download
								</Button>
								<Button onclick={copyToClipboard} variant="outline">
									{#if copied}
										<Check class="mr-2 h-4 w-4" />
										Copied
									{:else}
										<Copy class="mr-2 h-4 w-4" />
										Copy
									{/if}
								</Button>
								<Button onclick={reset} variant="outline">Clean Another</Button>
							</div>
						</div>
					</div>

					<!-- View Toggle -->
					<div class="flex gap-2">
						<Button
							variant={!showCleanOnly ? 'default' : 'outline'}
							onclick={() => (showCleanOnly = false)}
							class={!showCleanOnly ? 'bg-orange-500 hover:bg-orange-600' : ''}
						>
							Diff View
						</Button>
						<Button
							variant={showCleanOnly ? 'default' : 'outline'}
							onclick={() => (showCleanOnly = true)}
							class={showCleanOnly ? 'bg-orange-500 hover:bg-orange-600' : ''}
						>
							Clean Output
						</Button>
					</div>

					<!-- Diff / Clean View -->
					<div
						class="max-h-[600px] overflow-y-auto rounded-xl border border-border/50 bg-background p-4 font-mono text-sm"
					>
						{#if showCleanOnly}
							<pre class="whitespace-pre-wrap">{result.cleaned}</pre>
						{:else}
							{#each result.blocks as block, i}
								<div
									class={cn(
										'rounded px-3 py-2',
										block.removed
											? 'border-l-4 border-red-500 bg-red-500/10 line-through opacity-70'
											: ''
									)}
								>
									<div class="text-muted-foreground">{block.index}</div>
									<div class="text-muted-foreground">{block.timestamp}</div>
									{#each block.contentLines as line}
										<div>{line}</div>
									{/each}
								</div>
								{#if i < result.blocks.length - 1}
									<div class="my-2"></div>
								{/if}
							{/each}
						{/if}
					</div>

					<!-- Bazarr Tip -->
					<div class="rounded-xl border border-border/50 bg-card/50 p-6">
						<h3 class="mb-2 flex items-center text-lg font-semibold text-foreground">
							<Shield class="mr-2 h-5 w-5 text-orange-500" />
							Works with Bazarr, Plex, Jellyfin & Emby
						</h3>
						<p class="text-muted-foreground">
							Use this tool to clean subtitle files before importing them, or check out our <a
								href="/subtitles/guide"
								class="text-orange-500 hover:underline">guide</a
							> for tips on integrating subtitle cleaning into your Bazarr post-processing workflow.
						</p>
					</div>
				</div>
			{/if}

			<!-- Features -->
			<div class="mt-12 grid gap-6 md:grid-cols-3">
				<div class="rounded-lg border border-border/50 bg-card/30 p-6 text-center">
					<Shield class="mx-auto mb-3 h-8 w-8 text-orange-500" />
					<h3 class="mb-2 text-lg font-semibold">100% Private</h3>
					<p class="text-sm text-muted-foreground">
						Everything runs in your browser. No files are uploaded to any server.
					</p>
				</div>
				<div class="rounded-lg border border-border/50 bg-card/30 p-6 text-center">
					<FileText class="mx-auto mb-3 h-8 w-8 text-orange-500" />
					<h3 class="mb-2 text-lg font-semibold">Smart Detection</h3>
					<p class="text-sm text-muted-foreground">
						Detects and removes ads, watermarks, and promotional blocks from subtitle providers.
					</p>
				</div>
				<div class="rounded-lg border border-border/50 bg-card/30 p-6 text-center">
					<Download class="mx-auto mb-3 h-8 w-8 text-orange-500" />
					<h3 class="mb-2 text-lg font-semibold">Instant Download</h3>
					<p class="text-sm text-muted-foreground">
						Download your cleaned subtitle file or copy the output to your clipboard.
					</p>
				</div>
			</div>
		</section>
	</main>
</div>
