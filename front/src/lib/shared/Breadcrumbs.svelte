<script>
    import Link from './Link.svelte';

    export let items;
    export let hasBackground = false;
</script>

<div class="relative flex gap-3 z-10">
    {#each items as item, index}
        {#if items.length - 1 !== index}
            <Link href={item.path ?? '#'} className="text-blue-300 hover:text-blue-500 duration-300 transition-colors">
                <span>{item.label}</span>
            </Link>
            <span class:text-white={hasBackground} class="dark:text-white">></span>
        {:else}
            <span class:text-white={hasBackground} class="dark:text-white">{item.label}</span>
        {/if}
    {/each}
</div>
