<script>
    import Icon from './Icon.svelte';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let tag;
</script>

<button
    class="rounded-full px-2 py-1 relative flex gap-1 group"
    style="background-color: rgba({tag.red}, {tag.green}, {tag.blue}, 0.8); opacity: 0.7;"
    type="button"
    on:click={() => dispatch('delete')}
>
    <span>{tag.name}</span>
    <span class="group-hover:text-primary-500">
        <Icon name="close" />
    </span>
</button>
