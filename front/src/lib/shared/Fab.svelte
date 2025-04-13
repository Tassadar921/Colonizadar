<script lang="ts">
    import Icon from './Icon.svelte';
    import Button from './Button.svelte';

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

    export let horizontal: Props['horizontal'] = 'right';
    export let vertical: Props['vertical'] = 'bottom';
    export let icon: string = '';

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
</script>

<Button
    on:click
    customStyle
    style="z-index: 5000"
    className="text-white shadow-lg flex items-center justify-center fixed size-10 rounded-full bg-primary-600 hover:bg-primary-900 transition-colors duration-300
        {verticalClasses[vertical]}
        {horizontalClasses[horizontal]}"
>
    <Icon name={icon} />
</Button>
