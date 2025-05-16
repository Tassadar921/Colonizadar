<script lang="ts">
	import type SerializedRoomPlayer from 'colonizadar-backend/app/types/serialized/serialized_room_player';
	import axios from 'axios';
	import { showToast } from '../../services/toastService';
	import type SerializedRoom from 'colonizadar-backend/app/types/serialized/serialized_room';
	import Fab from '../shared/Fab.svelte';
	import { profile } from '../../stores/profileStore';

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

<button class="bg-red-500 hover:bg-red-500 rounded-full px-3 py-2 text-white" on:click={() => handleReady(player)}>Ready ?</button>
