<script lang="ts">
    import { t } from 'svelte-i18n';
    import type SerializedGame from 'colonizadar-backend/app/types/serialized/serialized_game';
    import { showToast } from '../../services/toastService';
    import type SerializedRoomPlayer from 'colonizadar-backend/app/types/serialized/serialized_room_player';
    import Modal from '../shared/Modal.svelte';
    import Subtitle from '../shared/Subtitle.svelte';
    import Range from '../shared/Range.svelte';
    import Form from '../shared/Form.svelte';
    import type SerializedGameTerritory from 'colonizadar-backend/app/types/serialized/serialized_game_territory';
    import ActionButton from '../shared/ActionButton.svelte';

    export let game: SerializedGame;
    export let currentPlayer: SerializedRoomPlayer;
    export let selectedTerritory: SerializedGameTerritory;

    let amount: number;
    let showModal: boolean = false;
    let canSubmit: boolean = false;
    let isButtonDisabled: boolean = false;

    const handleSuccess = async (event: CustomEvent): Promise<void> => {
        game = {
            ...game,
            players: game.players.map((player: SerializedRoomPlayer) => {
                if (event.detail.player.id === player.id) {
                    amount = game.map.financeWildTerritoryStep;
                    return event.detail.player;
                }
                return player;
            }),
        };
        selectedTerritory.infantry = undefined;
        showToast(event.detail.message);
    };

    $: isButtonDisabled = currentPlayer.isReady || (currentPlayer?.gold ?? 0) < game.map.financeWildTerritoryStep;
    $: canSubmit = !currentPlayer.isReady && amount >= game.map.financeWildTerritoryStep && amount % game.map.financeWildTerritoryStep === 0 && amount <= (currentPlayer?.gold ?? 0);
</script>

<ActionButton {isButtonDisabled} on:click={() => (showModal = true)}>
    <span slot="text">{$t('play.game.finance')}</span>
</ActionButton>

<Modal bind:showModal>
    <Subtitle slot="header">{$t('play.game.finance-player-modal.title')}</Subtitle>
    <Form
        method="PATCH"
        action={`/api/game/${game.id}/actions/territory/${selectedTerritory.territory.code}/finance`}
        hasBackground={false}
        isValid={canSubmit}
        isFormVisible={showModal}
        on:success={handleSuccess}
    >
        <Range name="amount" bind:value={amount} min={game.map.financeWildTerritoryStep} max={currentPlayer?.gold ?? 0} step={game.map.financeWildTerritoryStep} />
    </Form>
</Modal>
