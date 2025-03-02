<script>
    import Map from '../game/Map.svelte';
    import {onMount} from "svelte";

    let containerElement;

    onMount(() => {
        containerElement.style.height = `${window.innerHeight - 100}px`;
    });
</script>

<div bind:this={containerElement} class="bg-red-500 flex justify-center align-middle">
    <Map />
</div>
