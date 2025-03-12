<script>
    import Button from '../shared/Button.svelte';
    import Icon from '../shared/Icon.svelte';
    import axios from 'axios';
    import { showToast } from '../../services/toastService.js';
    import { t } from 'svelte-i18n';
    import { onMount } from 'svelte';
    import { profile } from '../../stores/profileStore.js';

    export let room;
    export let maps = [];

    onMount(async () => {
        try {
            const { data } = await axios.get('/api/room/maps');
            maps = data;
            console.log(maps);
        } catch (e) {
            showToast(e.response.data.error, 'error');
        }
    });

    const handleSelectMap = async () => {
        try {
            const { data } = await axios.post(`/api/room/${room.id}/add-bot`);
            showToast(`${$t('toast.room.add-bot.success')} : ${data.player.bot.name}`);
        } catch (e) {
            showToast(e.response.data.error, 'error');
        }
    };
</script>

{#if $profile.id === room.owner.id}
    <div class="flex flex-grow justify-end"></div>
{/if}
