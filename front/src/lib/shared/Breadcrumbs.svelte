<script lang="ts">
	import Link from './Link.svelte';

	interface Breadcrumb {
		label: string;
		path?: string;
	}

	export let items: Breadcrumb[];
    // TODO: put this back when we'll have a form background
	export let hasBackground: boolean = false;
</script>

<div class="relative flex gap-3 z-10">
	{#each items as item, index}
		{#if items.length - 1 !== index}
			<Link href={item.path ?? '#'} className="text-blue-500 hover:text-blue-700 dark:text-blue-300 dark:hover:text-blue-500 duration-300 transition-colors">
				<span>{item.label}</span>
			</Link>
<!--			<span class:text-white={hasBackground} class="dark:text-white">></span>-->
			<span class="dark:text-white">></span>
		{:else}
<!--			<span class:text-white={hasBackground} class="dark:text-white">{item.label}</span>-->
			<span class="dark:text-white">{item.label}</span>
		{/if}
	{/each}
</div>
