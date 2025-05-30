<script lang="ts">
    import type SerializedGameTerritory from 'colonizadar-backend/app/types/serialized/serialized_game_territory';
    import { t } from 'svelte-i18n';
    import { createEventDispatcher } from 'svelte';
    import ActionButton from '../shared/ActionButton.svelte';
    import type SerializedRoomPlayer from 'colonizadar-backend/app/types/serialized/serialized_room_player';

    const dispatch = createEventDispatcher();

    export let selectedTerritory: SerializedGameTerritory;
    export let currentPlayer: SerializedRoomPlayer;

    let isButtonDisabled: boolean = false;

    $: isButtonDisabled = currentPlayer.isReady || ((!selectedTerritory.ships || selectedTerritory.ships === 0) && (!selectedTerritory.infantry || selectedTerritory.infantry <= 1000));
</script>

<ActionButton {isButtonDisabled} on:click={() => dispatch('move')}>
    <span slot="text">{$t('play.game.move')}</span>
</ActionButton>
