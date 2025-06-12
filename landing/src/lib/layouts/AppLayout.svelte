<script lang="ts">
    import type { Component } from 'svelte';

    export let component: Component<any>;
    export let props: Record<string, any> = {};
</script>

<div class="px-3.5 min-h-screen">
    <svelte:component this={component} {...props} />
</div>
