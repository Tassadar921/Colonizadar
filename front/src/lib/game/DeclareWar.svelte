<script lang="ts">
    import { t } from 'svelte-i18n';
    import type SerializedGame from 'colonizadar-backend/app/types/serialized/serialized_game';
    import { showToast } from '../../services/toastService';
    import type SerializedRoomPlayer from 'colonizadar-backend/app/types/serialized/serialized_room_player';
    import axios from 'axios';
    import ActionButton from './ActionButton.svelte';

    export let game: SerializedGame;
    export let targetPlayer: SerializedRoomPlayer;

    const handleDeclareWar = async (): Promise<void> => {
        try {
            const { data } = await axios.put(`/api/game/${game.id}/actions/player/${targetPlayer.id}/war/declare`);
            showToast(data.message);
        } catch (error: any) {
            showToast(error.response.data.error, 'error');
        }
    };
</script>

<ActionButton on:click={handleDeclareWar}>
    <span slot="text">{$t('play.game.declare-war')}</span>
</ActionButton>
