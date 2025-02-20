<script>
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let options = [];
    export let selectedOption = null;
    export let name = null;
    export let label = '';
    export let required = false;

    const handleSelect = (e) => {
        selectedOption = options.find((option) => {
            return option.value === Number(e.target.value);
        });
        dispatch('change', { selectedOption });
    };
</script>

<div class="w-full">
    {#if label}
        <label for={name} class="block font-medium dark:text-primary-500 absolute bottom-11 left-1 mb-1">
            {label}
            {#if required}
                <span class="text-red-500">*</span>
            {/if}
        </label>
    {/if}

    <select {name} class="w-full px-3 py-2 border border-gray-300 text-gray-800 dark:text-gray-300 dark:border-gray-800 dark:bg-gray-700 rounded-lg shadow-sm focus:outline-none hover:cursor-pointer" on:change={handleSelect}>
        {#each options as option}
            <option class="capitalize" value={option.value} selected={selectedOption?.value === option.value}>
                {option.label}
            </option>
        {/each}
    </select>
</div>
