<script>
	import { getContext } from 'svelte';
	import { slide } from 'svelte/transition';

	const { isOpen } = getContext('accordion-item');
</script>

{#if $isOpen}
	<div
		transition:slide={{ duration: 200 }}
		class="overflow-hidden text-sm transition-all data-[state=closed]:animate-accordion-up data-[state=open]:animate-accordion-down"
		data-state={$isOpen ? 'open' : 'closed'}
	>
		<div class="pb-4 pt-0">
			<slot />
		</div>
	</div>
{/if}
