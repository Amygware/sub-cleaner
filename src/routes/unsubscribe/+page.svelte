<script lang="ts">
	import { onMount } from 'svelte';
	import { goto } from '$app/navigation';
	import { fetchSubreddits, batchUnsubscribe } from '$lib/utils';
	import { toast } from 'svelte-sonner';
	import LoadingOverlay from '$lib/components/LoadingOverlay.svelte';
	import { Button } from '$lib/components/ui/button/index.js';
	import { ScrollArea } from '$lib/components/ui/scroll-area/index.js';

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
	<div class="fixed left-0 right-0 top-0 z-20 bg-blue-100 p-4 shadow-lg">
		<div class="container mx-auto">
			<div class="flex items-center justify-between">
				<div>
					<h1 class="text-2xl font-bold">Your Subreddits</h1>
					{#if !loading && !error}
						<p class="mt-1 text-sm opacity-70">
							{subreddits.length} subreddits • {totalSubscribers.toLocaleString()} total subscribers
							{#if selectedCount > 0}
								• {selectedCount} selected
							{/if}
						</p>
					{/if}
				</div>
				<button
					class="btn btn-outline"
					on:click={() => {
						localStorage.removeItem('reddit_token');
						goto('/');
					}}
				>
					Switch Account
				</button>
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
						<input
							type="text"
							bind:value={searchQuery}
							placeholder="Search unselected subreddits..."
							class="input input-neutral w-full"
						/>
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
			<div class="z-0 mt-4 grid grid-cols-1 gap-6 md:grid-cols-2">
				<div class="card-body flex-none border-b">
					<h3 class="text-xl">Available Subreddits ({filteredUnselectedSubreddits.length})</h3>
				</div>
				<div class="card-body flex justify-between border-b">
					<h3 class="text-xl">Selected for Unsubscribe ({selectedSubreddits.length})</h3>
					<div class="mx-auto flex justify-end">
						<!--
							<button
								class="btn bg-blue-400"
								on:click={handleUnsubscribe}
								disabled={unsubscribing || selectedSubreddits.length === 0}
							>
								Unsubscribe from Selected ({selectedSubreddits.length})
							</button>
							-->
						<Button onclick={handleUnsubscribe} variant="destructive"
							>Unsubscribe from Selected ({selectedSubreddits.length})</Button
						>
					</div>
				</div>
			</div>
		</div>
	</div>

	{#if !loading && !error}
		<div class="z-0 grid h-[calc(100vh-8rem)] grid-cols-1 gap-6 pt-[12rem] md:grid-cols-2">
			<!-- Unselected Subreddits -->
			<div class="card bg-base-100 flex flex-col">
				<div class="card-body h-80 flex-1 overflow-auto p-0">
					<div class="space-y-2 p-4">
						{#each filteredUnselectedSubreddits as sr (sr.id)}
							<button
								class="card card-compact bg-base-200 hover:bg-base-300 w-full transition-colors"
								on:click={() => handleSubredditClick(sr)}
							>
								<div class="card-body">
									<div class="flex items-center justify-between">
										<div class="flex-1">
											<div class="flex items-center gap-3">
												{#if sr.icon}
													<img
														src={sr.icon}
														alt={`${sr.name} icon`}
														class="h-8 w-8 rounded-full object-cover"
														on:error={(e) =>
															((e.currentTarget as HTMLImageElement).src =
																'https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png')}
													/>
												{:else}
													<div
														class="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full"
													>
														<span class="text-primary text-lg">r/</span>
													</div>
												{/if}
												<div>
													<h3 class="card-title text-base">r/{sr.name}</h3>
													<p class="text-sm opacity-70">
														{sr.subscribers?.toLocaleString() ?? 0} subscribers
													</p>
												</div>
											</div>
											{#if sr.description}
												<p class="mt-1 line-clamp-2 text-sm opacity-70">
													{sr.description}
												</p>
											{/if}
										</div>
										<span class="text-primary">→</span>
									</div>
								</div>
							</button>
						{/each}
					</div>
				</div>
			</div>

			<!-- Selected Subreddits -->
			<div class="card bg-base-100 flex flex-col">
				<div class="card-body flex-1 overflow-y-auto p-0">
					<div class="space-y-2 p-4">
						{#each selectedSubreddits as sr (sr.id)}
							<button
								class="card card-compact bg-primary/5 hover:bg-primary/10 w-full transition-colors"
								on:click={() => handleSubredditClick(sr)}
							>
								<div class="card-body">
									<div class="flex items-center justify-between">
										<span class="text-primary">←</span>
										<div class="flex-1">
											<div class="flex items-center gap-3">
												{#if sr.icon}
													<img
														src={sr.icon}
														alt={`${sr.name} icon`}
														class="h-8 w-8 rounded-full object-cover"
														on:error={(e) =>
															((e.currentTarget as HTMLImageElement).src =
																'https://www.redditstatic.com/desktop2x/img/favicon/android-icon-192x192.png')}
													/>
												{:else}
													<div
														class="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full"
													>
														<span class="text-primary text-lg">r/</span>
													</div>
												{/if}
												<div>
													<h3 class="card-title text-base">r/{sr.name}</h3>
													<p class="text-sm opacity-70">
														{sr.subscribers?.toLocaleString() ?? 0} subscribers
													</p>
												</div>
											</div>
											{#if sr.description}
												<p class="mt-1 line-clamp-2 text-sm opacity-70">
													{sr.description}
												</p>
											{/if}
										</div>
									</div>
								</div>
							</button>
						{/each}
					</div>
				</div>
			</div>
		</div>
	{/if}
</div>

{#if loading || unsubscribing}
	<LoadingOverlay message={loadingMessage} />
{/if}
