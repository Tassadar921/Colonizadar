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
    import Move from './Move.svelte';

    export let game: SerializedGame;
    export let selectedTerritory: SerializedGameTerritory;
    export let selectedTerritoryOwner: SerializedRoomPlayer;
    export let currentPlayer: SerializedRoomPlayer;

    const checkedProfile: SerializedUser = $profile!;
</script>

<div class="flex gap-1 items-center">
    <p>{$t('play.game.country-modal.owner')} :</p>
    <InGamePlayer bind:game bind:player={selectedTerritoryOwner} />
</div>
<p>{$t('play.game.country-modal.value')} : {formatGameNumbers(selectedTerritory.value ?? 0)}</p>
<p>{$t('play.common.infantry')} : {selectedTerritory.infantry ? formatGameNumbers(selectedTerritory.infantry) : '???'}</p>
{#if selectedTerritory && selectedTerritoryOwner && selectedTerritory.territory.isCoastal}
    <p>{$t('play.common.ships')} : {typeof selectedTerritory.ships === 'number' ? formatGameNumbers(selectedTerritory.ships) : '???'}</p>
{/if}
<p>{$t('play.game.fortified')} : {selectedTerritory.isFortified}</p>
<div class="flex gap-5 justify-center">
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
