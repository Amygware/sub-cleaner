<script lang="ts">
	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner';
	import { onMount } from 'svelte';
	import { dev } from '$app/environment';
	import { inject } from '@vercel/analytics';

	let { children } = $props();

	onMount(() => {
		inject({ mode: dev ? 'development' : 'production' });
	});
</script>

<div class="bg-base-100 min-h-screen" data-theme="light">
	<main class="container mx-auto px-4 py-8">
		{@render children()}
	</main>
</div>

<Toaster closeButton />
