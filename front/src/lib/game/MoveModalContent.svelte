<script lang="ts">
    import type SerializedGameTerritory from "colonizadar-backend/app/types/serialized/serialized_game_territory";
    import Form from "../shared/Form.svelte";
    import Range from "../shared/Range.svelte";

    export let selectedTerritory: SerializedGameTerritory;
    export let targetTerritory: SerializedGameTerritory;

    export let infantryAmount: number;
    export let shipsAmount: number;
</script>

<Form
    submittable={false}
    hasBackground={false}
>
    <Range name="amount" bind:value={infantryAmount} min={1000} max={selectedTerritory.infantry} step={1000} />
    <Range name="amount" bind:value={shipsAmount} min={5} max={selectedTerritory.ships} step={5} />
</Form>

