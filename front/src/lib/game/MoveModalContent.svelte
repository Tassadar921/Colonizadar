<script lang="ts">
    import type SerializedGameTerritory from 'colonizadar-backend/app/types/serialized/serialized_game_territory';
    import Form from '../shared/Form.svelte';
    import Range from '../shared/Range.svelte';
    import { t } from 'svelte-i18n';
    import Icon from '../shared/Icon.svelte';

    export let selectedTerritory: SerializedGameTerritory;
    export let targetTerritory: SerializedGameTerritory;

    let infantryAmount: number;
    let shipsAmount: number;

    let isButtonDisabled: boolean = false;
    let isLoading: boolean = false;
    let buttonElement: HTMLButtonElement;

    const handleMove = async (): Promise<void> => {};

    $: isButtonDisabled =
        isLoading ||
        (infantryAmount === 0 && shipsAmount === 0) ||
        infantryAmount % 1000 !== 0 ||
        shipsAmount % 5 !== 0 ||
        (selectedTerritory.infantry ?? 0) < infantryAmount ||
        (selectedTerritory.ships ?? 0) < shipsAmount;
</script>

<Form submittable={false} hasBackground={false}>
    <Range name="amount" bind:value={infantryAmount} min={0} max={selectedTerritory.infantry} step={1000} label={$t('play.common.infantry')} />
    <Range name="amount" bind:value={shipsAmount} min={0} max={selectedTerritory.ships} step={5} label={$t('play.common.ships')} />

    <div class="flex justify-end mt-5 pr-5">
        <button bind:this={buttonElement} disabled={isButtonDisabled} class="flex gap-3 bg-green-500 hover:bg-green-600 transition-colors duration-300 px-3 py-1 rounded-xl" on:click={handleMove}>
            {#if isLoading}
                <Icon name="spinner" />
            {:else}
                {$t('play.game.move')}
                <span class="">
                    <Icon name="send" />
                </span>
            {/if}
        </button>
    </div>
</Form>
