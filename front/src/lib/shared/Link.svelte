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

    let isAbsolute: boolean = href.startsWith('http://') || href.startsWith('https://');

    const handleClick = (event: MouseEvent) => {
        if (target === '' || target === '_self') {
            event.preventDefault();
            if (href) {
                dispatch('click');
                if (isAbsolute) {
                    window.open(href, target);
                } else {
                    navigate(href);
                }
            }
        }
    };
</script>

<a href={isAbsolute ? href : `/${$language}${href}`} aria-label={ariaLabel} {target} class={className} {style} on:mouseenter on:mouseleave on:focus on:blur on:click={handleClick}>
    <slot />
</a>
