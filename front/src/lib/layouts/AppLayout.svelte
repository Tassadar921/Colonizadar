<script lang="ts">
    import Menu from '../menu/Menu.svelte';
    import Footer from '../shared/Footer.svelte';
    import type { Component } from 'svelte';

    export let component: Component<any>; // <- This is the key line
    export let props: Record<string, any> = {};
</script>

<div class="px-3.5 min-h-screen">
    <Menu />

    <svelte:component this={component} {...props} />
</div>

<Footer />
