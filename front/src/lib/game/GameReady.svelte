<script lang="ts">
    import type SerializedRoomPlayer from 'colonizadar-backend/app/types/serialized/serialized_room_player';
    import axios from 'axios';
    import { showToast } from '../../services/toastService';
    import type SerializedGame from 'colonizadar-backend/app/types/serialized/serialized_game';
    import { t } from 'svelte-i18n';
    import ActionButton from '../shared/ActionButton.svelte';

    export let game: SerializedGame;
    export let currentPlayer: SerializedRoomPlayer;

    let isLoading: boolean = false;

    const handleReady = async () => {
        isLoading = true;
        try {
            await axios.patch(`/api/game/${game.id}/ready`);
        } catch (error: any) {
            showToast(error.response.data.error, 'error');
        }
        isLoading = false;
    };
</script>

<ActionButton {isLoading} on:click={() => handleReady()} color={currentPlayer.isReady ? 'green' : 'red'}>
    <span slot="text">{$t('play.common.ready')} ?</span>
</ActionButton>
