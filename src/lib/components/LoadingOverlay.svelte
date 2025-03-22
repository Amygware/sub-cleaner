<script lang="ts">
	export let message: string = 'Loading...';
</script>

<div class="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
	<div
		class="flex flex-col items-center space-y-4 rounded-lg bg-white p-8 shadow-xl dark:bg-gray-800"
	>
		<div
			class="h-12 w-12 animate-spin rounded-full border-4 border-orange-500 border-t-transparent"
		></div>
		<p class="text-sm text-gray-600 dark:text-gray-300">{message}</p>
	</div>
</div>
