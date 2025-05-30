<script lang="ts">
    import { createEventDispatcher } from 'svelte';
    import type SerializedGameTerritory from 'colonizadar-backend/app/types/serialized/serialized_game_territory';
    import Icon from '../shared/Icon.svelte';
    import { formatGameNumbers } from '../../services/stringService';
    import type { Move } from 'colonizadar-backend/app/types/Move';

    const dispatch = createEventDispatcher();

    export let selectedTerritory: SerializedGameTerritory;
    export let move: Move;
</script>

<div class="flex gap-3 justify-between items-center bg-white dark:bg-gray-800 p-2 rounded-xl border border-gray-200 dark:border-gray-600">
    <span class="text-primary-500">
        {#if move.isAttack}
            <Icon name="attack" />
        {:else}
            <Icon name="move" />
        {/if}
    </span>
    <p>{selectedTerritory.territory.name}</p>
    <span class="text-primary-500">
        {#if move.isTarget}
            <Icon name="arrowLeft" />
        {:else}
            <Icon name="arrowRight" />
        {/if}
    </span>
    <p>{move.isTarget ? move.fromName : move.toName}</p>
    <p class="flex gap-1 w-2/3">
        (
        <span class="text-primary-500">
            <Icon name="infantry" />
        </span>
        {formatGameNumbers(move.infantry)}
        {#if move.ships > 0}
            ,
            <span class="text-primary-500">
                <Icon name="ship" />
            </span>
            {formatGameNumbers(move.ships)}
        {/if}
        )
    </p>
    <button class="text-red-400 hover:text-red-500 transition-colors duration-200" on:click={() => dispatch('delete', move)}>
        <Icon name="close" />
    </button>
</div>
