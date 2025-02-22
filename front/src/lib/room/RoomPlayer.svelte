<script>
    import Select from '../shared/Select.svelte';
    import Icon from '../shared/Icon.svelte';
    import KickPlayer from './KickPlayer.svelte';
    import { profile } from '../../stores/profileStore.js';
    import axios from 'axios';
    import { showToast } from '../../services/toastService.js';

    export let playableCountries = [];
    export let room;
    export let player;

    let invalidCountry = true;
    let selectedCountry = null;

    const handleSelectCountry = async (event) => {
        try {
            const { data } = await axios.patch(`/api/room/${room.id}/player/${player.id}/select-country`, {
                countryId: event.detail.value,
            });
            showToast(`${data.message}`);
        } catch (e) {
            showToast(e.response.data.error, 'error');
        }
    };

    $: if (player.country) {
        selectedCountry = {
            value: player.country.id,
            label: player.country.name,
            uri: `${process.env.VITE_API_BASE_URL}/api/static/country-flag/${player.country.id}?token=${localStorage.getItem('apiToken')}`
        };
        invalidCountry = room.players.reduce((acc, player) => {
            return acc + !!(player.country.id === selectedCountry.value);
        }, 0) > 1;
    }
</script>

<div
    class="flex justify-between items-center border {invalidCountry ? 'shadow-md shadow-red-500' : ''} {player.user && $profile.id === player.user.id
        ? 'border-gray-400 dark:border-gray-700'
        : 'border-gray-300 dark:border-gray-800'} rounded-xl hover:bg-gray-300 dark:hover:bg-gray-800 transition-colors duration-300 px-3"
>
    <div class="flex gap-5 flex-wrap items-center">
        {#if player.user}
            {#if player.user.profilePicture}
                <img
                    alt={player.user.username}
                    src={`${process.env.VITE_API_BASE_URL}/api/static/profile-picture/${player.user.id}?token=${localStorage.getItem('apiToken')}`}
                    class="size-10 rounded-full"
                />
            {:else}
                <img alt={player.user.username} src={process.env.VITE_DEFAULT_IMAGE} class="max-h-10 rounded-full" />
            {/if}
            <p class="flex gap-0.5 {player.user.id === $profile.id ? 'font-bold' : ''}">
                {#if room.owner.id === player.user.id}
                    <span class="text-orange-500">
                        <Icon name="crown" />
                    </span>
                {/if}
                {player.user.username}
            </p>
        {:else if player.bot}
            <img alt={player.bot.name} src={`${process.env.VITE_API_BASE_URL}/api/static/bot-picture/${player.bot.id}?token=${localStorage.getItem('apiToken')}`} class="w-10 rounded-full" />
            <p>{player.bot.name}</p>
        {/if}
        {#if (player.user && player.user.id === $profile.id) || (player.bot && room.owner.id === $profile.id)}
            <div>
                <Select bind:options={playableCountries} on:change={handleSelectCountry} bind:selectedOption={selectedCountry} />
            </div>
        {:else}
            <div class="flex gap-1.5 items-center">
                <img
                    alt={player.country.name}
                    src={`${process.env.VITE_API_BASE_URL}/api/static/country-flag/${player.country.id}?token=${localStorage.getItem('apiToken')}`}
                    class="max-h-10" />
                <p>{player.country.name}</p>
            </div>
        {/if}
    </div>

    {#if $profile.id === room.owner.id && $profile.id !== player.user?.id}
        <KickPlayer bind:room bind:player />
    {/if}
</div>
