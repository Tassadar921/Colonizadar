<script>
    import { navigate } from '../../stores/locationStore.ts';
    import { createEventDispatcher } from 'svelte';
    import { language } from '../../stores/languageStore.ts';

    const dispatch = createEventDispatcher();

    export let href = '';
    export let className = '';
    export let target = '';
    export let ariaLabel = '';
    export let style = '';

    const handleClick = (event) => {
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
