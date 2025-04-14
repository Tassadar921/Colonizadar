<script lang="ts">
    import type SerializedRoomPlayer from 'colonizadar-backend/app/types/serialized/serialized_room_player';
    import axios from 'axios';
    import { showToast } from '../../services/toastService';
    import type SerializedRoom from 'colonizadar-backend/app/types/serialized/serialized_room';
    import Fab from '../shared/Fab.svelte';

    export let room: SerializedRoom;
    export let player: SerializedRoomPlayer;
    export let isLoading: boolean = false;

    let color = 'green';

    const handleReady = async (player: SerializedRoomPlayer) => {
        isLoading = true;
        try {
            await axios.patch(`/api/room/${room.id}/player/${player.id}/ready`, {
                isReady: !player.isReady,
            });
        } catch (error: any) {
            showToast(error.response.data.error, 'error');
        }
        isLoading = false;
    };

    $: color = player.isReady ? 'green' : 'red';
</script>

<Fab ariaLabel="Ready toggle" horizontal="middle" vertical="bottom" icon="check" bind:color on:click={() => handleReady(player)} />
