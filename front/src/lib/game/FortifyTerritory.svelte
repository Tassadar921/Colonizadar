<script lang="ts">
    import { t } from 'svelte-i18n';
    import type SerializedGame from 'colonizadar-backend/app/types/serialized/serialized_game';
    import { showToast } from '../../services/toastService';
    import type SerializedRoomPlayer from 'colonizadar-backend/app/types/serialized/serialized_room_player';
    import axios from 'axios';
    import { formatGameNumbers } from '../../services/stringService';
    import type SerializedGameTerritory from 'colonizadar-backend/app/types/serialized/serialized_game_territory';
    import ActionButton from './ActionButton.svelte';

    export let game: SerializedGame;
    export let selectedTerritory: SerializedGameTerritory;
    export let currentPlayer: SerializedRoomPlayer;

    let isButtonDisabled: boolean = false;
    let isLoading: boolean = false;

    const handleFortify = async (): Promise<void> => {
        isLoading = true;
        try {
            const { data } = await axios.patch(`/api/game/${game.id}/actions/territory/${selectedTerritory.territory.code}/fortify`);
            game = {
                ...game,
                players: game.players.map((player: SerializedRoomPlayer) => {
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

    $: isButtonDisabled = isLoading || (currentPlayer?.gold ?? 0) < game.map.fortifyCost;
</script>

<ActionButton {isButtonDisabled} {isLoading} on:click={handleFortify}>
    <span slot="text">{$t('play.game.fortify')}</span>
    <p slot="informations">{$t('play.game.cost')} : {formatGameNumbers(game?.map.fortifyCost ?? 0)}</p>
</ActionButton>
