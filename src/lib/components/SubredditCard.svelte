<script lang="ts">
	import type { Subreddit } from '$lib/types';
	import { MoveRight, MoveLeft } from '@lucide/svelte';
	export let subreddit: Subreddit;
	export let direction: 'left' | 'right' = 'right';
	export let variant: 'default' | 'selected' = 'default';

	$: classes = {
		default: 'hover:bg-primary/10',
		selected: 'bg-primary/5 hover:bg-secondary/5'
	}[variant];
</script>

<button class="m-1 min-h-24 w-full rounded-xl transition-colors {classes}" on:click>
	<div class="">
		<div class="flex items-center justify-between gap-2 p-2">
			<div class="flex-1">
				<div class="flex items-center gap-3">
					{#if subreddit.icon}
						<img
							src={subreddit.icon}
							alt={`${subreddit.name} icon`}
							class="h-8 w-8 rounded-full object-cover"
							on:error={(e) =>
								((e.currentTarget as HTMLImageElement).src = '/images/subreddit-fallback.svg')}
						/>
					{:else}
						<div class="bg-primary/10 flex h-8 w-8 items-center justify-center rounded-full">
							<span class="text-primary text-lg">r/</span>
						</div>
					{/if}
					<div class="flex w-full justify-between">
						<h3 class="card-title text-base">r/{subreddit.name}</h3>
						<p class="hidden text-sm opacity-70 md:block">
							{subreddit.subscribers?.toLocaleString() ?? 0} subscribers
						</p>
					</div>
				</div>
				{#if subreddit.description}
					<p class="mt-1 line-clamp-2 hidden text-sm opacity-70 lg:block">
						{subreddit.description}
					</p>
				{/if}
			</div>
			{#if direction === 'right'}
				<MoveRight />
			{:else}
				<MoveLeft />
			{/if}
		</div>
	</div>
</button>

<link rel="preload" href="/images/subreddit-fallback.svg" as="image">
