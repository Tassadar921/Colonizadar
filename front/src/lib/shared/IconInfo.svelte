<script lang="ts">
    import Popover from './Popover.svelte';
    import Icon from './Icon.svelte';

    let show: boolean = false;
    let iconElement: HTMLButtonElement;
</script>

<div class="flex items-center justify-center">
    <button
        class="flex items-center justify-center bg-blue-500 text-white rounded-full size-8"
        bind:this={iconElement}
        on:mouseover={() => (show = true)}
        on:focus={() => (show = true)}
        on:mouseleave={() => (show = false)}
        on:blur={() => (show = false)}
    >
        <Icon name="help" />
    </button>

    <Popover {show} target={iconElement}>
        <slot />
    </Popover>
</div>
