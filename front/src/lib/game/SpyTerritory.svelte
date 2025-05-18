<script lang="ts">
    import { t } from 'svelte-i18n';
    import type SerializedGame from 'colonizadar-backend/app/types/serialized/serialized_game';
    import type SerializedGameTerritory from 'colonizadar-backend/app/types/serialized/serialized_game_territory';
    import axios from 'axios';
    import { showToast } from '../../services/toastService';
    import type SerializedRoomPlayer from 'colonizadar-backend/app/types/serialized/serialized_room_player';
    import Icon from '../shared/Icon.svelte';
    import { onMount, tick } from 'svelte';
    import { formatGameNumbers } from '../../services/stringService';

    export let game: SerializedGame;
    export let selectedTerritory: SerializedGameTerritory;
    export let currentPlayer: SerializedRoomPlayer;

    let isButtonDisabled: boolean = false;
    let isLoading: boolean = false;
    let buttonElement: HTMLButtonElement;
    let cost: number = 0;

    onMount(async (): Promise<void> => {
        await tick();
        const { width, height } = buttonElement.getBoundingClientRect();
        buttonElement.style.setProperty('width', `${width}px`);
        buttonElement.style.setProperty('height', `${height}px`);
    });

    const handleSpyTerritory = async (): Promise<void> => {
        isLoading = true;
        try {
            const { data } = await axios.get(`/api/game/${game.id}/actions/territory/${selectedTerritory.territory.code}/spy`);
            game = {
                ...game,
                territories: game.territories.map((gt: SerializedGameTerritory) => {
                    if (gt.territory.code === selectedTerritory.territory.code) {
                        selectedTerritory = data.territory;
                        return data.territory;
                    }
                    return gt;
                }),
                players: game.players.map((player: SerializedGameTerritory) => {
                    if (data.player.id === player.id) {
                        return data.player;
                    }
                    return player;
                }),
            };
            showToast(data.message);
        } catch (error: any) {
            showToast(error.response.data.error, 'error');
        }
        isLoading = false;
    };

    $: cost = selectedTerritory.isFortified ? (selectedTerritory.territory.isFactory ? game.map.spyFactoryCost : game.map.spyFortifiedTerritoryCost) : game.map.spyTerritoryCost;
    $: isButtonDisabled = isLoading || (currentPlayer?.gold ?? 0) < game.map.spyCost || !!selectedTerritory.infantry;
</script>

<div class="flex gap-1 flex-col justify-center items-center">
    <button
        bind:this={buttonElement}
        class="{isButtonDisabled ? '' : 'hover:bg-green-600'} flex justify-center items-center bg-green-500 transition-colors duration-300 px-3 py-1 rounded-xl"
        on:click={handleSpyTerritory}
        disabled={isButtonDisabled}
    >
        {#if isLoading}
            <Icon name="spinner" />
        {:else}
            {$t('play.game.spy')}
        {/if}
    </button>

    <p>{$t('play.game.cost')} : {formatGameNumbers(cost)}</p>
</div>
