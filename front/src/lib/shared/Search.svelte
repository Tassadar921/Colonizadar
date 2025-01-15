<script>
    import { t } from 'svelte-i18n';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let search = '';
    export let placeholder = null;
    export let debounce = 300;
    export let minChars = 3;
    export let name = '';
    export let disabled = false;
    export let label = '';
    export let selected = false;
    export let results = [];
    export let selectedObserver = false;

    let searchTimeout = null;
    let focused = false;

    const searchFunction = async () => {
        if (search.length < minChars) {
            results = [];
            return;
        }
        dispatch('search');
    };

    const searchDebounced = (event) => {
        clearTimeout(searchTimeout);

        if (event.key === 'Enter') {
            event.preventDefault();
            dispatch('search', true);
        } else {
            searchTimeout = setTimeout(searchFunction, debounce);
        }
    };

    const handleFocus = () => {
        focused = true;
        dispatch('focus');
    };

    const handleBlur = () => {
        focused = false;
        dispatch('blur');
    };

    $: placeholder = placeholder ?? $t('common.search');

    $: if (selectedObserver && selected) {
        name.focus();
    }
</script>

<div class="relative w-full mt-8">
    <label
        for={name}
        class="absolute pointer-events-none z-10 transition-all duration-800 ease-in-out {focused || search.length
            ? 'text-primary-500 bottom-11 left-1'
            : 'text-gray-500 bottom-2.5 left-3'}">{label}</label
    >
    <input
        on:focus={handleFocus}
        on:blur={handleBlur}
        on:keydown={searchDebounced}
        type="search"
        bind:value={search}
        bind:this={name}
        placeholder={focused || search.length ? placeholder : ''}
        {name}
        {disabled}
        class="block w-full px-3 py-2 mt-1 text-base text-gray-800 placeholder-gray-500 border border-gray-300 rounded-md
    shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
    />
</div>

<style>
    label {
        transition:
            bottom 0.8s ease,
            left 0.8s ease,
            color 0.8s ease;
    }
</style>
