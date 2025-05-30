<script lang="ts">
    import Icon from './Icon.svelte';
    import Popover from './Popover.svelte';

    export let isButtonDisabled: boolean = false;
    export let isLoading: boolean | undefined = undefined;
    export let color: 'green' | 'red' = 'green';
    export let popoverText: string | undefined = undefined;

    let buttonElement: HTMLButtonElement;
    let showPopover: boolean = false;

    const updatePopoverState = (event: MouseEvent | FocusEvent, showPopoverValue: boolean): void => {
        if (isButtonDisabled || isLoading || !popoverText) {
            event.preventDefault();
            event.stopPropagation();
            showPopover = false;
            return;
        }

        showPopover = showPopoverValue;
    };
</script>

<div class="flex gap-1 flex-col justify-center items-center">
    <button
        bind:this={buttonElement}
        class="flex justify-center items-center bg-green-500 transition-all duration-300 px-3 py-1 w-28 rounded-xl"
        class:opacity-50={isLoading || isButtonDisabled}
        class:bg-green-500={color === 'green'}
        class:hover:bg-green-600={!isButtonDisabled && color === 'green'}
        class:bg-red-500={color === 'red'}
        class:hover:bg-red-600={!isButtonDisabled && color === 'red'}
        class:hover:scale-105={!isButtonDisabled}
        on:click
        on:mouseenter={(event) => updatePopoverState(event, true)}
        on:focus={(event) => updatePopoverState(event, true)}
        on:mouseleave={(event) => updatePopoverState(event, false)}
        on:blur={(event) => updatePopoverState(event, false)}
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

<Popover target={buttonElement} show={showPopover}>
    <span>{popoverText}</span>
</Popover>
