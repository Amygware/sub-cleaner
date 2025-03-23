<script lang="ts">
	export let message: string = 'Loading...';
	import FlickeringGrid from '$lib/components/FlickeringGrid.svelte';
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
	<div class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
		<FlickeringGrid
			squareSize={8}
			gridGap={6}
			color="#60A5FA"
			maxOpacity={0.5}
			flickerChance={0.2}
			height={200}
			width={200}
		/>
		<p class="mt-4 text-center text-sm text-gray-600 dark:text-gray-300">{message}</p>
	</div>
</div>

<style>
	@keyframes flicker {
		0%,
		100% {
			opacity: 0.2;
		}
		50% {
			opacity: 0.8;
		}
	}
</style>
