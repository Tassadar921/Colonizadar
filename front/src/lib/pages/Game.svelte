<script lang="ts">
    import Map from '../game/Map.svelte';
    import { onMount } from 'svelte';
    import axios from 'axios';
    import { showToast } from '../../services/toastService';
    import { navigate } from '../../stores/locationStore';
    import Title from '../shared/Title.svelte';
    import type SerializedGame from 'colonizadar-backend/app/types/serialized/serialized_game';

    export let gameId: string;

    let game: SerializedGame;

    onMount(async (): Promise<void> => {
        try {
            const { data: gameData } = await axios.get(`/api/game/${gameId}`);
            game = gameData.game;
        } catch (error: any) {
            showToast(error.response.data.error, 'error');
            navigate('/play');
        }
    });
</script>

<Title title={game?.name} />

<div class="flex justify-center align-middle">
    <Map bind:game />
</div>
