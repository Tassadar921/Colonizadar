<script lang="ts">
    import { onMount } from 'svelte';

    export let title: string;

    onMount((): void => {
        document.title = title;
    });
</script>

<h1 class="relative z-10 text-3xl font-bold mb-2">{title}</h1>
