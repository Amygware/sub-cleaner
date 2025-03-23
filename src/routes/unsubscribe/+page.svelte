<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { fetchSubreddits, batchUnsubscribe } from '$lib/utils';
	import { toast } from 'svelte-sonner';
	import LoadingOverlay from '$lib/components/LoadingOverlay.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { Input } from '$lib/components/ui/input/index.js';
	import { Trash, Trash2 } from '@lucide/svelte';
	import SubredditCard from '$lib/components/SubredditCard.svelte';
	import type { Subreddit } from '$lib/types';
	import { Separator } from '$lib/components/ui/separator/index.js';
	import Sun from '@lucide/svelte/icons/sun';
	import Moon from '@lucide/svelte/icons/moon';
	import { toggleMode } from 'mode-watcher';

	interface Subreddit {
		id: string;
		name: string;
		subscribers: number;
		description: string;
		icon: string;
		selected: boolean;
	}

	let subreddits: Subreddit[] = [];
	let loading = true;
	let loadingMessage = 'Fetching your subreddits...';
	let searchQuery = '';
	let unsubscribing = false;
	let progress = { current: 0, total: 0 };
	let error: string | null = null;
	let sortOrder: 'asc' | 'desc' = 'desc';

	onMount(async () => {
		const token = localStorage.getItem('reddit_token');
		console.log('Token available:', !!token);

		if (!token) {
			error = 'No authentication token found. Please log in again.';
			toast.error(error);
			goto('/');
			return;
		}

		try {
			const fetchedSubreddits = await fetchSubreddits(token);
			if (!fetchedSubreddits) {
				throw new Error('No subreddits data received');
			}

			subreddits = fetchedSubreddits.map((sr: Omit<Subreddit, 'selected'>) => ({
				...sr,
				selected: false
			}));
			toast.success(`Successfully loaded ${subreddits.length} subreddits`);
		} catch (err) {
			console.error('Error fetching subreddits:', err);
			error =
				err instanceof Error
					? err.message
					: 'Failed to fetch subreddits. Please try logging in again.';
			toast.error(error);
			if (error.includes('401') || error.includes('403')) {
				localStorage.removeItem('reddit_token');
				goto('/');
			}
		} finally {
			loading = false;
		}
	});

	$: filteredUnselectedSubreddits = subreddits
		.filter((sr) => !sr.selected)
		.filter(
			(sr) =>
				sr.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
				(sr.description && sr.description.toLowerCase().includes(searchQuery.toLowerCase()))
		)
		.sort((a, b) => {
			const multiplier = sortOrder === 'desc' ? -1 : 1;
			return (a.subscribers - b.subscribers) * multiplier;
		});

	$: selectedSubreddits = subreddits
		.filter((sr) => sr.selected)
		.sort((a, b) => {
			const multiplier = sortOrder === 'desc' ? -1 : 1;
			return (a.subscribers - b.subscribers) * multiplier;
		});

	$: totalSubscribers = subreddits.reduce((sum, sr) => sum + (sr.subscribers || 0), 0);
	$: selectedCount = selectedSubreddits.length;

	function handleSelectAll(event: Event) {
		const target = event.target as HTMLInputElement;
		subreddits = subreddits.map((sr) => ({ ...sr, selected: target.checked }));
		toast.info(target.checked ? 'Selected all subreddits' : 'Deselected all subreddits');
	}

	function toggleSortOrder() {
		sortOrder = sortOrder === 'desc' ? 'asc' : 'desc';
	}

	async function handleUnsubscribe() {
		const token = localStorage.getItem('reddit_token');
		if (!token) {
			toast.error('No authentication token found. Please log in again.');
			goto('/');
			return;
		}

		const subredditsToUnsubscribe = selectedSubreddits.map((sr) => sr.name);
		if (subredditsToUnsubscribe.length === 0) {
			toast.error('Please select at least one subreddit to unsubscribe from');
			return;
		}

		unsubscribing = true;
		loadingMessage = 'Unsubscribing from selected subreddits...';
		progress = { current: 0, total: subredditsToUnsubscribe.length };

		const toastId = toast.loading('Unsubscribing from selected subreddits...');

		try {
			await batchUnsubscribe(token, subredditsToUnsubscribe, (current, total) => {
				progress = { current, total };
				loadingMessage = `Unsubscribing... (${current}/${total})`;
			});

			subreddits = subreddits.filter((sr) => !sr.selected);
			toast.success('Successfully unsubscribed from selected subreddits', {
				id: toastId
			});
		} catch (err) {
			console.error('Error unsubscribing:', err);
			error =
				err instanceof Error
					? err.message
					: 'Failed to unsubscribe from some subreddits. Please try again.';
			toast.error(error, {
				id: toastId
			});
			if (error.includes('401') || error.includes('403')) {
				localStorage.removeItem('reddit_token');
				goto('/');
			}
		} finally {
			unsubscribing = false;
		}
	}

	function handleSubredditClick(sr: Subreddit) {
		subreddits = subreddits.map((s) => (s.id === sr.id ? { ...s, selected: !s.selected } : s));
	}
</script>

<div class="container mx-auto p-4">
	<div class="fixed left-0 right-0 top-0 z-20 border-b p-4">
		<div class="container mx-auto">
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-2xl font-bold">Sub Cleaner</h1>
					{#if !loading && !error}
						<p class="mt-1 text-sm opacity-70">
							{subreddits.length} subreddits • {totalSubscribers.toLocaleString()} total subscribers
							{#if selectedCount > 0}
								• {selectedCount} selected
							{/if}
						</p>
					{/if}
				</div>
				<div class="flex items-center gap-2">
					<Button
						onclick={handleUnsubscribe}
						disabled={unsubscribing || selectedSubreddits.length === 0}
					>
						{#if selectedSubreddits.length === 0}
							<Trash />
						{:else}
							<Trash2 />
						{/if}
						Unsubscribe from Selected ({selectedSubreddits.length})
					</Button>
					<Button
						onclick={() => {
							localStorage.removeItem('reddit_token');
							goto('/');
						}}
						variant="outline">Switch Account</Button
					>
					<Button onclick={toggleMode} variant="outline" size="icon">
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

			{#if error}
				<div class="alert alert-error mt-4">
					<span>{error}</span>
					<button
						class="btn btn-ghost btn-sm"
						on:click={() => {
							localStorage.removeItem('reddit_token');
							goto('/');
						}}
					>
						Return to login
					</button>
				</div>
			{:else if !loading}
				<div class="mt-4 flex items-center gap-4">
					<div class="relative flex-1">
						<Input
							bind:value={searchQuery}
							type="text"
							placeholder="Search unselected subreddits..."
						></Input>
						{#if searchQuery}
							<button
								class="btn btn-ghost btn-sm absolute right-2 top-1/2 -translate-y-1/2"
								on:click={() => (searchQuery = '')}
							>
								✕
							</button>
						{/if}
					</div>
					<button class="btn btn-outline" on:click={toggleSortOrder}>
						Sort by size
						<span class="ml-2">
							{#if sortOrder === 'desc'}
								↓
							{:else}
								↑
							{/if}
						</span>
					</button>
					<label class="flex cursor-pointer items-center gap-2">
						<input type="checkbox" class="checkbox checkbox-primary" on:change={handleSelectAll} />
						<span class="text-sm">Select All</span>
					</label>
				</div>

				{#if unsubscribing}
					<div class="alert mt-4">
						<div class="flex w-full flex-col">
							<div class="mb-2 flex justify-between text-sm">
								<span>Unsubscribing...</span>
								<span>{progress.current}/{progress.total}</span>
							</div>
							<progress
								class="progress progress-primary w-full"
								value={progress.current}
								max={progress.total}
							/>
						</div>
					</div>
				{/if}
			{/if}
		</div>
	</div>
	{#if !loading && !error}
		<div class="flex h-[calc(100vh-6rem)] flex-col pt-24">
			<div class="flex flex-1 overflow-hidden">
				<!-- Unselected Subreddits -->
				<div class="flex w-1/2 flex-col overflow-hidden border-r">
					<div class="bg-base-100 flex-none border-b p-4">
						<h3 class="text-xl">Available Subreddits ({filteredUnselectedSubreddits.length})</h3>
					</div>
					<div class="flex-1 overflow-y-auto">
						<div class="space-y-2 p-4">
							{#each filteredUnselectedSubreddits as sr (sr.id)}
								<Separator />
								<SubredditCard
									subreddit={sr}
									direction="right"
									variant="default"
									on:click={() => handleSubredditClick(sr)}
								/>
							{/each}
						</div>
					</div>
				</div>

				<!-- Selected Subreddits -->
				<div class="flex w-1/2 flex-col overflow-hidden">
					<div class="flex w-full justify-between border-b p-4">
						<h3 class="text-xl">Selected for Unsubscribe ({selectedSubreddits.length})</h3>
					</div>
					<div class="flex-1 overflow-y-auto">
						<div class="space-y-2 p-4">
							{#each selectedSubreddits as sr (sr.id)}
								<Separator />
								<SubredditCard
									subreddit={sr}
									direction="left"
									variant="selected"
									on:click={() => handleSubredditClick(sr)}
								/>
							{/each}
						</div>
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

{#if loading || unsubscribing}
	<LoadingOverlay message={loadingMessage} />
{/if}
