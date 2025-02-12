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
            console.log(response);
            showToast(`${$t('toast.room.add-bot.success')} : ${response.data.player.bot.name}`);
        } catch (e) {
            showToast(e.response.data.error, 'error');
        }
    };
</script>

<div>
    <Button
        ariaLabel="Add a bot"
        customStyle
        className="flex items-center gap-3 rounded-full hover:scale-105 bg-green-500 hover:bg-green-600 dark:bg-green-700 dark:hover:bg-green-600 transition-all duration-300 p-1 px-4"
        on:click={handleAddBot}
    >
        <Icon name="plus" />
        <span>{$t('play.room.add-bot')}</span>
    </Button>
</div>
