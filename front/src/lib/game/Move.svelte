<script lang="ts">
    import type SerializedGameTerritory from 'colonizadar-backend/app/types/serialized/serialized_game_territory';
    import { t } from 'svelte-i18n';
    import { createEventDispatcher } from 'svelte';
    import ActionButton from './ActionButton.svelte';

    const dispatch = createEventDispatcher();

    export let selectedTerritory: SerializedGameTerritory;

    let isButtonDisabled: boolean = false;

    $: isButtonDisabled = (!selectedTerritory.ships || selectedTerritory.ships === 0) && (!selectedTerritory.infantry || selectedTerritory.infantry <= 1000);
</script>

<ActionButton {isButtonDisabled} on:click={() => dispatch('move')}>
    <span slot="text">{$t('play.game.move')}</span>
</ActionButton>
