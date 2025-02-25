<script>
    import { createEventDispatcher, onMount, onDestroy } from 'svelte';
    import Icon from './Icon.svelte';

    const dispatch = createEventDispatcher();

    export let options = [];
    export let selectedOption = null;
    export let name = '';
    export let label = '';
    export let required = false;

    let isOpen = false;
    let chevronIcon = 'chevronDown';
    let dropdownRef;
    let buttonRef;
    let dropdownWidth = 'auto';

    const handleSelect = (option) => {
        selectedOption = option;
        isOpen = false;
        dispatch('change', { ...option });
    };

    const handleClickOutside = (event) => {
        if (dropdownRef && !dropdownRef.contains(event.target)) {
            isOpen = false;
        }
    };

    const setDropdownWidth = () => {
        if (buttonRef) {
            dropdownWidth = `${buttonRef.offsetWidth}px`;
        }
    };

    onMount(() => {
        window.addEventListener('click', handleClickOutside);
        setDropdownWidth();
    });

    onDestroy(() => {
        window.removeEventListener('click', handleClickOutside);
    });
</script>

<div class="w-full relative" bind:this={dropdownRef}>
    {#if label}
        <label for={name} class="block font-medium dark:text-primary-500 mb-1">
            {label}
            {#if required}
                <span class="text-red-500">*</span>
            {/if}
        </label>
    {/if}

    <input type="hidden" {name} value={selectedOption?.value} />

    <button
        bind:this={buttonRef}
        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-800 dark:bg-gray-700 dark:text-gray-300 rounded-xl shadow-sm flex justify-between items-center flex-wrap gap-5"
        on:click={() => {
            isOpen = !isOpen;
            setDropdownWidth();
        }}
    >
        <span class="flex items-center">
            {#if selectedOption?.uri}
                <img src={selectedOption.uri} alt={selectedOption.label} class="mr-2" />
            {/if}
            {selectedOption?.label || 'Select an option'}
        </span>
        <span class="dark:text-primary-500 transform transition-transform duration-300" class:rotate-180={isOpen}>
            <Icon bind:name={chevronIcon} />
        </span>
    </button>

    {#if isOpen}
        <ul
            class="absolute left-0 mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-700 rounded-lg shadow-lg z-10 max-h-60 overflow-auto min-w-max whitespace-nowrap"
            style="width: {dropdownWidth};"
        >
            {#each options as option}
                <button class="flex items-center px-3 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 w-full" on:click={() => handleSelect(option)}>
                    {#if option.uri}
                        <img src={option.uri} alt={option.label} class="mr-2" />
                    {/if}
                    <span class="capitalize dark:text-white">{option.label}</span>
                </button>
            {/each}
        </ul>
    {/if}
</div>
