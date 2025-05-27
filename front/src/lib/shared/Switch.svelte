<script lang="ts">
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let value: boolean = false;
    export let size: number = 2;
    export let disabled: boolean = false;
    export let label: string = '';
    export let name: string = '';
    export let required: boolean = false;

    const handleToggleChange = (event: Event) => {
        const target = event.target as HTMLInputElement;
        value = target.checked;
        dispatch('change', value);
    };
</script>

{#if name}
    <input type="checkbox" {name} bind:checked={value} {required} class="sr-only peer" style="position: absolute; opacity: 0; pointer-events: none;" />
{/if}
<div class="flex flex-row gap-3">
    <label class="inline-flex items-center {disabled ? '' : 'cursor-pointer'}">
        <input type="checkbox" on:change={handleToggleChange} class="sr-only peer" bind:checked={value} {disabled} aria-required={required} />
        <span
            class="relative border border-gray-600 bg-gray-400 dark:bg-gray-500 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-gray-500 rounded-full peer peer-checked:bg-primary-600 peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white toggle-circle"
            style="width: {size * 8}px; height: {size * 4 + 2}px;"
        >
            <span
                class="absolute top-0 left-0 rounded-full transition-all duration-300 border"
                class:bg-primary-500={value}
                class:border-primary-600={value}
                class:bg-white={!value}
                class:border-gray-300={!value}
                style:width="{size * 4}px"
                style:height="{size * 4}px"
                style:transform="translateX({value ? size * 4 : 0}px)"
            ></span>
        </span>
    </label>
    {#if label}
        <p class={value ? 'duration-300 transition-colors text-primary-500' : ''}>
            {label}
            {#if required}
                <span class="text-red-500">*</span>
            {/if}
        </p>
    {/if}
</div>
