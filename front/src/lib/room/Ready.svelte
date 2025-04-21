<script lang="ts">
	import type SerializedRoomPlayer from 'colonizadar-backend/app/types/serialized/serialized_room_player';
	import axios from 'axios';
	import { showToast } from '../../services/toastService';
	import type SerializedRoom from 'colonizadar-backend/app/types/serialized/serialized_room';
	import Fab from '../shared/Fab.svelte';

	export let room: SerializedRoom;
	export let player: SerializedRoomPlayer;
	export let isLoading: boolean = false;

	let color: 'red' | 'green' = 'green';
    let icon: string = 'check';
    let iconSize: number = 24;

	const handleReady = async (player: SerializedRoomPlayer) => {
		isLoading = true;
        icon = 'spinner';
        iconSize = 36;
		try {
			await axios.patch(`/api/room/${room.id}/player/${player.id}/ready`, {
				isReady: !player.isReady,
			});
		} catch (error: any) {
			showToast(error.response.data.error, 'error');
		}
		isLoading = false;
        icon = 'check';
        iconSize = 24;
	};

	$: color = player.isReady ? 'green' : 'red';
</script>

<Fab ariaLabel="Ready toggle" horizontal="middle" vertical="bottom" {icon} {iconSize} {color} on:click={() => handleReady(player)} />
