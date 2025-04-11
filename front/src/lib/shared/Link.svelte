<script lang="ts">
    import { navigate } from '../../stores/locationStore';
    import { createEventDispatcher } from 'svelte';
    import { language } from '../../stores/languageStore';

    const dispatch = createEventDispatcher();

    export let href: string = '';
    export let className: string = '';
    export let target: string = '';
    export let ariaLabel: string = '';
    export let style: string = '';

    const handleClick = (event: MouseEvent) => {
        if (target === '' || target === '_self') {
            event.preventDefault();
            if (href) {
                dispatch('click');
                navigate(href);
            }
        }
    };
</script>

<a href={`/${$language}${href}`} aria-label={ariaLabel} {target} class={className} {style} on:mouseenter on:mouseleave on:focus on:blur on:click={handleClick}>
    <slot />
</a>
