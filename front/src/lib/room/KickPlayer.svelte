<script>
    import Button from '../shared/Button.svelte';
    import Icon from '../shared/Icon.svelte';
    import axios from 'axios';
    import { showToast } from '../../services/toastService.js';
    import { t } from 'svelte-i18n';

    export let room;
    export let player;

    const handleKick = async (player) => {
        try {
            const response = await axios.delete(`/api/room/${room.id}/kick/${player.id}`);
            showToast(`${response.data.message}`);
            room.players = room.players.filter((p) => p.id !== player.id);
        } catch (e) {
            showToast(e.response.data.error, 'error');
        }
    };
</script>

<Button
    ariaLabel="Kick user from room"
    customStyle
    className="transition-all duration-300 hover:scale-110 mt-2 transform text-red-600 hover:text-red-400"
    on:click={() => handleKick(player)}
>
    <Icon name="close" />
</Button>
