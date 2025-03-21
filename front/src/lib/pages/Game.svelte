<script>
    import Map from '../game/Map.svelte';
    import { onMount } from 'svelte';
    import axios from 'axios';
    import { showToast } from '../../services/toastService.js';
    import { navigate } from '../../stores/locationStore.js';
    import Title from '../shared/Title.svelte';

    export let gameId;

    let game;

    onMount(async () => {
        try {
            const { data: gameData } = await axios.get(`/api/game/${gameId}`);
            game = gameData.game;
        } catch (e) {
            showToast(e.response.data.error, 'error');
            // navigate('/play');
        }
    });
</script>

<Title title={game?.name} />

<div class="h-5/6 flex justify-center align-middle">
    <Map bind:game />
</div>
