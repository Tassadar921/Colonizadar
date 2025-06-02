<script lang="ts">
    import { t } from 'svelte-i18n';
    import type SerializedGame from 'colonizadar-backend/app/types/serialized/serialized_game';
    import type SerializedGameTerritory from 'colonizadar-backend/app/types/serialized/serialized_game_territory';
    import axios from 'axios';
    import { showToast } from '../../services/toastService';
    import type SerializedRoomPlayer from 'colonizadar-backend/app/types/serialized/serialized_room_player';
    import { formatGameNumbers } from '../../services/stringService';
    import ActionButton from '../shared/ActionButton.svelte';

    export let game: SerializedGame;
    export let selectedTerritory: SerializedGameTerritory;
    export let currentPlayer: SerializedRoomPlayer;

    let isButtonDisabled: boolean = false;
    let isLoading: boolean = false;
    let cost: number = 0;

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
    $: isButtonDisabled = isLoading || (currentPlayer?.gold ?? 0) < cost || !!selectedTerritory.infantry || currentPlayer.isReady;
</script>

<ActionButton {isButtonDisabled} {isLoading} on:click={handleSpyTerritory}>
    <span slot="text">{$t('play.game.spy')}</span>
    <p slot="informations">{$t('play.game.cost')} : {formatGameNumbers(cost)}</p>
</ActionButton>
