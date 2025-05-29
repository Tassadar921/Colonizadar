<script lang="ts">
    import Icon from './Icon.svelte';
    import { onMount } from 'svelte';

    export let isButtonDisabled: boolean = false;
    export let isLoading: boolean | undefined = undefined;
    export let buttonElement: HTMLButtonElement | undefined = undefined;
    export let color: 'green' | 'red' = 'green';

    let internalButton: HTMLButtonElement;

    onMount(() => {
        if (buttonElement !== undefined) {
            buttonElement = internalButton;
        }
    });
</script>

<div class="flex gap-1 flex-col justify-center items-center">
    <button
        bind:this={internalButton}
        class="flex justify-center items-center bg-green-500 transition-colors duration-300 px-3 py-1 w-28 rounded-xl"
        class:opacity-50={isLoading || isButtonDisabled}
        class:bg-green-500={!isButtonDisabled && color === 'green'}
        class:hover:bg-green-600={!isButtonDisabled && color === 'green'}
        class:bg-red-500={!isButtonDisabled && color === 'red'}
        class:hover:bg-red-600={!isButtonDisabled && color === 'red'}
        on:click
        on:mouseenter
        on:focus
        on:mouseleave
        on:blur
        disabled={isButtonDisabled}
    >
        {#if isLoading}
            <Icon name="spinner" />
        {:else}
            <slot name="text" />
        {/if}
    </button>

    <slot name="informations" />
</div>
