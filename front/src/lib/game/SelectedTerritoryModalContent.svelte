<script lang="ts">
    import { formatGameNumbers } from '../../services/stringService.js';
    import SubvertWildTerritory from './SubvertWildTerritory.svelte';
    import FinanceWildTerritory from './FinanceWildTerritory.svelte';
    import SpyTerritory from './SpyTerritory.svelte';
    import BuyInfantry from './BuyInfantry.svelte';
    import BuyShips from './BuyShips.svelte';
    import InGamePlayer from './InGamePlayer.svelte';
    import FortifyTerritory from './FortifyTerritory.svelte';
    import type SerializedGame from 'colonizadar-backend/app/types/serialized/serialized_game';
    import type SerializedRoomPlayer from 'colonizadar-backend/app/types/serialized/serialized_room_player';
    import type SerializedGameTerritory from 'colonizadar-backend/app/types/serialized/serialized_game_territory';
    import type SerializedUser from 'colonizadar-backend/app/types/serialized/serialized_user';
    import { profile } from '../../stores/profileStore.js';
    import { t } from 'svelte-i18n';
    import { getSelectedTerritoryMoves, type Move as FetchedMove, removeMove } from '../../stores/dbStore';
    import Move from './Move.svelte';
    import type { GameTerritoryMove } from '../../types/GameTerritoryMove';
    import InLineMove from './InLineMove.svelte';

    export let game: SerializedGame;
    export let selectedTerritory: SerializedGameTerritory;
    export let selectedTerritoryOwner: SerializedRoomPlayer;
    export let currentPlayer: SerializedRoomPlayer;

    let moves: GameTerritoryMove[] = [];

    const checkedProfile: SerializedUser = $profile!;

    const handleDeleteMove = async (event: CustomEvent): Promise<void> => {
        await removeMove(event.detail.id);
        moves = moves.filter((move) => move.id !== event.detail.id);
        game = {
            ...game,
            territories: game.territories.map((gameTerritory: SerializedGameTerritory) => {
                if (gameTerritory.id === event.detail.from) {
                    return {
                        ...gameTerritory,
                        infantry: (gameTerritory.infantry ?? 0) + event.detail.infantry,
                        ships: (gameTerritory.ships ?? 0) + event.detail.ships,
                    };
                }
                return gameTerritory;
            }),
        };
        if (!event.detail.isTarget) {
            selectedTerritory = {
                ...selectedTerritory,
                infantry: (selectedTerritory.infantry ?? 0) + event.detail.infantry,
                ships: (selectedTerritory.ships ?? 0) + event.detail.ships,
            };
        }
    };

    $: if (selectedTerritory) {
        getSelectedTerritoryMoves(selectedTerritory).then((response: FetchedMove[]) => {
            moves = response.map((move) => {
                const isTarget: boolean = move.to === selectedTerritory.id;
                return {
                    ...move,
                    isTarget,
                    fromName: isTarget ? game.territories.find((gameTerritory: SerializedGameTerritory): boolean => gameTerritory.id === move.from)?.territory.name : undefined,
                    toName: isTarget ? undefined : game.territories.find((gameTerritory: SerializedGameTerritory): boolean => gameTerritory.id === move.to)?.territory.name,
                };
            });
        });
    }
</script>

<div class="flex gap-1 items-center">
    <p>{$t('play.game.country-modal.owner')} :</p>
    <InGamePlayer {game} player={selectedTerritoryOwner} />
</div>
<p>{$t('play.game.country-modal.value')} : {formatGameNumbers(selectedTerritory.value ?? 0)}</p>
<p>{$t('play.common.infantry')} : {selectedTerritory.infantry ? formatGameNumbers(selectedTerritory.infantry) : '???'}</p>
{#if selectedTerritory && selectedTerritoryOwner && selectedTerritory.territory.isCoastal}
    <p>{$t('play.common.ships')} : {typeof selectedTerritory.ships === 'number' ? formatGameNumbers(selectedTerritory.ships) : '???'}</p>
{/if}
<p>{$t('play.game.fortified')} : {selectedTerritory.isFortified}</p>
<div class="flex gap-5 justify-center items-start mt-3">
    {#if game.map.mainSeason === game.season && selectedTerritory}
        {#if selectedTerritoryOwner?.user?.id !== checkedProfile.id}
            <SpyTerritory bind:game bind:selectedTerritory {currentPlayer} />
            {#if !selectedTerritoryOwner}
                <FinanceWildTerritory bind:game bind:selectedTerritory {currentPlayer} />
                <SubvertWildTerritory bind:game bind:selectedTerritory {currentPlayer} />
            {/if}
        {:else}
            <Move bind:selectedTerritory on:move />
            {#if !selectedTerritory.isFortified}
                <FortifyTerritory bind:game {selectedTerritory} {currentPlayer} />
            {:else if selectedTerritory.territory.isFactory}
                <BuyInfantry bind:game bind:selectedTerritory {currentPlayer} />
                <BuyShips bind:game bind:selectedTerritory {currentPlayer} />
            {/if}
        {/if}
    {/if}
</div>

{#if moves.length > 0}
    <div class="mt-3">
        {#each moves as move}
            <InLineMove {selectedTerritory} {move} on:delete={handleDeleteMove} />
        {/each}
    </div>
{/if}
