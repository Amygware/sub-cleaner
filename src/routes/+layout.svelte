<script lang="ts">
	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner';
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';
	import { ModeWatcher } from 'mode-watcher';

	let { children } = $props();

	onMount(() => {
		inject({ mode: dev ? 'development' : 'production' });
	});
</script>

<ModeWatcher />

<div class="bg-base-100 min-h-screen" data-theme="light">
	<main class="container mx-auto p-2 lg:px-4 lg:py-8">
		{@render children()}
	</main>
</div>

<Toaster closeButton />
