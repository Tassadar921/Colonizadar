<script lang="ts">
    import { t } from 'svelte-i18n';
    import type SerializedGame from 'colonizadar-backend/app/types/serialized/serialized_game';
    import axios from 'axios';
    import { showToast } from '../../services/toastService';
    import type SerializedRoomPlayer from 'colonizadar-backend/app/types/serialized/serialized_room_player';
    import Popover from '../shared/Popover.svelte';
    import { formatGameNumbers } from '../../services/stringService';
    import ActionButton from './ActionButton.svelte';

    export let game: SerializedGame;
    export let currentPlayer: SerializedRoomPlayer;
    export let player: SerializedRoomPlayer;

    let buttonElement: HTMLButtonElement;
    let isButtonDisabled: boolean = false;
    let showPopover: boolean = false;

    const handleSpyPlayer = async (): Promise<void> => {
        try {
            const { data } = await axios.get(`/api/game/${game.id}/actions/player/${player.id}/spy`);
            game = {
                ...game,
                players: game.players.map((pl: SerializedRoomPlayer) => {
                    if (data.player.id === pl.id) {
                        return data.player;
                    } else if (data.targetPlayer.id === pl.id) {
                        return data.targetPlayer;
                    }
                    return pl;
                }),
            };
            showToast(data.message);
        } catch (error: any) {
            showToast(error.response.data.error, 'error');
        }
    };

    $: isButtonDisabled = (currentPlayer?.gold ?? 0) < game.map.spyPlayerCost;
</script>

<ActionButton
    bind:buttonElement
    on:click={handleSpyPlayer}
    on:mouseenter={() => (showPopover = true)}
    on:focus={() => (showPopover = true)}
    on:mouseleave={() => (showPopover = false)}
    on:blur={() => (showPopover = false)}
    {isButtonDisabled}
>
    <span slot="text">{$t('play.game.spy')}</span>
</ActionButton>

<Popover target={buttonElement} show={showPopover}>
    <span>{$t('play.game.cost')} : {formatGameNumbers(game?.map.spyPlayerCost ?? 0)}</span>
</Popover>
