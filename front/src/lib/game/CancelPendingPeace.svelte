<script lang="ts">
    import { t } from 'svelte-i18n';
    import type SerializedGame from 'colonizadar-backend/app/types/serialized/serialized_game';
    import { showToast } from '../../services/toastService';
    import type SerializedRoomPlayer from 'colonizadar-backend/app/types/serialized/serialized_room_player';
    import axios from 'axios';
    import ActionButton from '../shared/ActionButton.svelte';

    export let game: SerializedGame;
    export let currentPlayer: SerializedRoomPlayer;
    export let targetPlayer: SerializedRoomPlayer;

    let isButtonDisabled: boolean = false;

    const handleCancelPendingPeace = async (): Promise<void> => {
        try {
            const { data } = await axios.delete(`/api/game/${game.id}/actions/player/${targetPlayer.id}/peace/cancel`);
            showToast(data.message);
        } catch (error: any) {
            showToast(error.response.data.error, 'error');
        }
    };

    $: isButtonDisabled = currentPlayer.isReady;
</script>

<ActionButton {isButtonDisabled} on:click={handleCancelPendingPeace}>
    <span slot="text">{$t('play.game.peace.cancel')}</span>
</ActionButton>
