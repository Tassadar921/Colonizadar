<script lang="ts">
    import type SerializedRoomPlayer from 'colonizadar-backend/app/types/serialized/serialized_room_player';
    import axios from 'axios';
    import { showToast } from '../../services/toastService';
    import type SerializedRoom from 'colonizadar-backend/app/types/serialized/serialized_room';
    import { t } from 'svelte-i18n';
    import ActionButton from '../shared/ActionButton.svelte';

    export let room: SerializedRoom;
    export let currentPlayer: SerializedRoomPlayer;

    let isLoading: boolean = false;

    const handleReady = async () => {
        isLoading = true;
        try {
            await axios.patch(`/api/room/${room.id}/player/ready`, {
                isReady: !currentPlayer.isReady,
            });
        } catch (error: any) {
            showToast(error.response.data.error, 'error');
        }
        isLoading = false;
    };
</script>

<ActionButton {isLoading} on:click={() => handleReady()} color={currentPlayer.isReady ? 'green' : 'red'}>
    <span slot="text">{$t('play.common.ready')} ?</span>
</ActionButton>
