<script lang="ts">
    import Icon from './Icon.svelte';

    export let horizontal: Props['horizontal'] = 'right';
    export let vertical: Props['vertical'] = 'bottom';
    export let icon: string = '';
    export let color: string = 'primary';
    export let ariaLabel: string;

    interface Props {
        horizontal: 'right' | 'left' | 'middle';
        vertical: 'top' | 'bottom' | 'center';
    }

    interface Horizontal {
        right: string;
        left: string;
        middle: string;
    }

    interface Vertical {
        top: string;
        bottom: string;
        center: string;
    }

    const validHorizontal: string[] = ['right', 'left', 'middle'];
    const validVertical: string[] = ['top', 'bottom', 'center'];

    $: horizontal = validHorizontal.includes(horizontal) ? horizontal : 'right';
    $: vertical = validVertical.includes(vertical) ? vertical : 'bottom';

    const horizontalClasses: Horizontal = {
        right: 'right-4',
        left: 'left-4',
        middle: 'left-1/2 transform -translate-x-1/2',
    };

    const verticalClasses: Vertical = {
        top: 'top-4',
        bottom: 'bottom-4',
        center: 'top-1/2 transform -translate-y-1/2',
    };

    $: console.log(`bg-${color}-500 hover:bg-${color}-900`);
</script>

<button
    on:click
    aria-label={ariaLabel}
    style="z-index: 5000"
    class={`text-white shadow-lg flex items-center justify-center fixed size-10 rounded-full
        transition-colors duration-300
        ${verticalClasses[vertical]}
        ${horizontalClasses[horizontal]}
        bg-${color}-500 hover:bg-${color}-900`}
>
    <Icon name={icon} />
</button>
