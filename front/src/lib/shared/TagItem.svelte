<script>
    import Button from './Button.svelte';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let tag;
</script>

<li>
    <Button
        customStyle={true}
        className="w-full text-left  p-3 bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 hover:dark:bg-gray-600 transition-colors duration-300"
        ariaLabel={tag}
        on:click={(event) => {
            event.stopPropagation();
            dispatch('select', tag);
        }}
    >
        {tag.name}
    </Button>
</li>
