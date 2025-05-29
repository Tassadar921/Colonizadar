<script lang="ts">
    import type SerializedRoomPlayer from 'colonizadar-backend/app/types/serialized/serialized_room_player';
    import axios from 'axios';
    import { showToast } from '../../services/toastService';
    import type SerializedRoom from 'colonizadar-backend/app/types/serialized/serialized_room';
    import { profile } from '../../stores/profileStore';
    import { t } from 'svelte-i18n';
    import ActionButton from '../shared/ActionButton.svelte';

    export let room: SerializedRoom;
    export let isLoading: boolean = false;

    let player: SerializedRoomPlayer;
    let color: 'red' | 'green' = 'green';
    let icon: string = 'check';

    const handleReady = async (player: SerializedRoomPlayer) => {
        isLoading = true;
        try {
            await axios.patch(`/api/room/${room.id}/player/ready`, {
                isReady: !player.isReady,
            });
        } catch (error: any) {
            showToast(error.response.data.error, 'error');
        }
        isLoading = false;
    };

    $: player = room.players.find((player: SerializedRoomPlayer): boolean => player.user?.id === $profile!.id);

    $: color = player.isReady ? 'green' : 'red';
</script>

<ActionButton {isLoading} on:click={() => handleReady(player)} {color}>
    <span slot="text">{$t('play.common.ready')} ?</span>
</ActionButton>
