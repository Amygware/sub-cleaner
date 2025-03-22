<script lang="ts">
	import '../app.css';
	import { Toaster } from '$lib/components/ui/sonner';
	let { children } = $props();
</script>

<div class="bg-base-100 min-h-screen" data-theme="light">
	<main class="container mx-auto px-4 py-8">
		{@render children()}
	</main>
</div>

<Toaster richColors closeButton />
