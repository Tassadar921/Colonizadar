<script lang="ts">
    import Icon from '../shared/Icon.svelte';

    export let isButtonDisabled: boolean = false;
    export let isLoading: boolean | undefined = undefined;
</script>

<div class="flex gap-1 flex-col justify-center items-center">
    <button
        class="{isButtonDisabled ? '' : 'hover:bg-green-600'} flex justify-center items-center bg-green-500 transition-colors duration-300 px-3 py-1 w-28 rounded-xl"
        on:click
        disabled={isButtonDisabled}
    >
        {#if isLoading !== undefined && isLoading}
            <Icon name="spinner" />
        {:else}
            <slot name="text" />
        {/if}
    </button>

    <slot name="informations" />
</div>
