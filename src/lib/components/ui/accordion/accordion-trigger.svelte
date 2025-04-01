<script>
	import { getContext } from 'svelte';
	import ChevronDown from '@lucide/svelte/icons/chevron-down';

	const { toggle } = getContext('accordion');
	const { value, isOpen } = getContext('accordion-item');

	function handleClick() {
		toggle(value);
	}
</script>

<h3>
	<button
		type="button"
		aria-expanded={$isOpen}
		class="flex w-full items-center justify-between py-4 font-medium transition-all hover:underline [&[data-state=open]>svg]:rotate-180"
		on:click={handleClick}
		data-state={$isOpen ? 'open' : 'closed'}
	>
		<slot />
		<ChevronDown class="h-4 w-4 shrink-0 transition-transform duration-200" />
	</button>
</h3>
