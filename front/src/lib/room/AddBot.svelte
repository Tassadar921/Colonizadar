<script>
    import Button from '../shared/Button.svelte';
    import Icon from '../shared/Icon.svelte';
    import axios from 'axios';
    import { showToast } from '../../services/toastService.js';
    import { t } from 'svelte-i18n';

    export let room;

    const handleAddBot = async () => {
        try {
            const response = await axios.post(`/api/room/${room.id}/add-bot`);
            if (response.status === 200) {
                showToast(`${$t('toast.room.add-bot.success')} : ${response.data.player.bot.name}`);
                room.players = [...room.players, response.data.player];
            } else {
                showToast(response.data.error, 'error');
            }
        } catch (e) {
            showToast(response.data.error, 'error');
        }
    };
</script>

<Button
    ariaLabel="Add a bot"
    customStyle
    className="rounded-full bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-600 transition-colors duration-300 p-1 mb-1.5"
    on:click={handleAddBot}
>
    <Icon name="plus" />
</Button>
