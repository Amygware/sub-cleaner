<script lang="ts">
	import { getContext, setContext } from 'svelte';
	import { writable, type Writable } from 'svelte/store';

	/**
	 * @type {string}
	 */
	export let value: string;

	type AccordionContext = {
		type: 'single' | 'multiple';
		value: Writable<string | string[] | undefined>;
		collapsible: boolean;
		toggle: (value: string) => void;
	};

	const { type, value: accordionValue } = getContext<AccordionContext>('accordion');
	const isOpen = writable(false);

	$: if (type === 'single') {
		$isOpen = $accordionValue === value;
	} else {
		$isOpen = ($accordionValue as string[]).includes(value);
	}

	setContext('accordion-item', {
		value,
		isOpen
	});
</script>

<div
	class="border-b data-[state=open]:bg-secondary/10"
	data-state={$isOpen ? 'open' : 'closed'}
>
	<slot />
</div>
