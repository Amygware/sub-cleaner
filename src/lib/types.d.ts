declare module '$lib/components/ui/input' {
	import type { SvelteComponent } from 'svelte';
	export class Input extends SvelteComponent<{
		class?: string;
		[key: string]: any;
	}> {}
}

declare module '$lib/components/ui/card' {
	import type { SvelteComponent } from 'svelte';
	export class Card extends SvelteComponent<{
		class?: string;
		[key: string]: any;
	}> {}
	export class CardHeader extends SvelteComponent<{
		class?: string;
		[key: string]: any;
	}> {}
	export class CardTitle extends SvelteComponent<{
		class?: string;
		[key: string]: any;
	}> {}
	export class CardContent extends SvelteComponent<{
		class?: string;
		[key: string]: any;
	}> {}
}

declare module '$lib/components/ui/checkbox' {
	import type { SvelteComponent } from 'svelte';
	export class Checkbox extends SvelteComponent<{
		class?: string;
		checked?: boolean;
		[key: string]: any;
	}> {}
}

declare module '$lib/components/ui/scroll-area' {
	import type { SvelteComponent } from 'svelte';
	export class ScrollArea extends SvelteComponent<{
		class?: string;
		[key: string]: any;
	}> {}
}
