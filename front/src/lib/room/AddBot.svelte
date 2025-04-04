<script>
    import Button from '../shared/Button.svelte';
    import Icon from '../shared/Icon.svelte';
    import axios from 'axios';
    import { showToast } from '../../services/toastService.js';
    import { t } from 'svelte-i18n';
    import { onMount } from 'svelte';
    import { profile } from '../../stores/profileStore.js';

    export let room;
    export let difficulties = [];

    onMount(async () => {
        try {
            const { data } = await axios.get('/api/room/bot-difficulties');
            difficulties = data.difficulties.map((difficulty) => ({ value: difficulty.id, label: difficulty.name }));
        } catch (e) {
            showToast(e.response.data.error, 'error');
        }
    });

    const handleAddBot = async () => {
        try {
            const { data } = await axios.post(`/api/room/${room.id}/add-bot`);
            showToast(`${$t('toast.room.add-bot.success')} : ${data.player.bot.name}`);
        } catch (e) {
            showToast(e.response.data.error, 'error');
        }
    };
</script>

{#if room.players.length < 6 && $profile.id === room.owner.id}
    <div class="flex flex-grow justify-end">
        <Button
            ariaLabel="Add a bot"
            customStyle
            className="flex items-center gap-3 rounded-full hover:scale-105 bg-green-600 dark:bg-green-600 transition-all duration-300 p-2 px-4 text-xl"
            on:click={handleAddBot}
        >
            <Icon name="plus" />
            <span>{$t('play.room.add-bot')}</span>
        </Button>
    </div>
{/if}
