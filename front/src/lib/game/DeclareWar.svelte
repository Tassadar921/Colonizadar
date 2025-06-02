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

    const handleDeclareWar = async (): Promise<void> => {
        try {
            const { data } = await axios.put(`/api/game/${game.id}/actions/player/${targetPlayer.id}/war/declare`);
            showToast(data.message);
        } catch (error: any) {
            showToast(error.response.data.error, 'error');
        }
    };

    $: isButtonDisabled = currentPlayer.isReady;
</script>

<ActionButton {isButtonDisabled} on:click={handleDeclareWar}>
    <span slot="text">{$t('play.game.declare-war')}</span>
</ActionButton>
