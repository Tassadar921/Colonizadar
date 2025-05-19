<script lang="ts">
    import type SerializedGameTerritory from 'colonizadar-backend/app/types/serialized/serialized_game_territory';
    import { t } from 'svelte-i18n';
    import { createEventDispatcher } from 'svelte';

    const dispatch = createEventDispatcher();

    export let selectedTerritory: SerializedGameTerritory;

    let isButtonDisabled: boolean = false;

    $: isButtonDisabled = (!selectedTerritory.ships || selectedTerritory.ships === 0) && (!selectedTerritory.infantry || selectedTerritory.infantry <= 1000);
</script>

<button disabled={isButtonDisabled} class="bg-green-500 hover:bg-green-600 transition-colors duration-300 px-3 py-1 rounded-xl" on:click={() => dispatch('move')}>
    {$t('play.game.move')}
</button>
