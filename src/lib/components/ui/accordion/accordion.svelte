<script lang="ts">
	import { setContext } from 'svelte';
	import { writable } from 'svelte/store';

	/**
	 * @type {'single' | 'multiple'}
	 */
	export let type = 'single';
	
	/**
	 * @type {boolean}
	 */
	export let collapsible = false;
	
	/**
	 * @type {string | undefined}
	 */
	export let value = undefined;
	
	/**
	 * @type {string[]}
	 */
	export let multiple = [];

	const accordionValue = writable(type === 'single' ? value : multiple);

	setContext('accordion', {
		type,
		collapsible,
		value: accordionValue,
		toggle: (itemValue: string) => {
			if (type === 'single') {
				if (collapsible && $accordionValue === itemValue) {
					accordionValue.set(undefined);
				} else {
					accordionValue.set(itemValue);
				}
				value = $accordionValue as string | undefined;
			} else {
				const currentValue = [...($accordionValue as string[])];
				const index = currentValue.indexOf(itemValue);
				if (index > -1) {
					currentValue.splice(index, 1);
					accordionValue.set([...currentValue]);
				} else {
					accordionValue.set([...currentValue, itemValue]);
				}
				multiple = $accordionValue as string[];
			}
		}
	});

	$: if (type === 'single' && value !== undefined) {
		accordionValue.set(value);
	}

	$: if (type === 'multiple' && multiple.length) {
		accordionValue.set(multiple);
	}
</script>

<div class={$$props.class}>
	<slot />
</div>
