<script lang="ts">
    import Select from '../shared/Select.svelte';
    import KickPlayer from './KickPlayer.svelte';
    import { profile } from '../../stores/profileStore';
    import axios from 'axios';
    import { showToast } from '../../services/toastService';
    import type SerializedRoom from 'colonizadar-backend/app/types/serialized/serialized_room';
    import type SerializedRoomPlayer from 'colonizadar-backend/app/types/serialized/serialized_room_player';
    import Icon from '../shared/Icon.svelte';

    export let playableCountries: Option[] = [];
    export let botDifficulties: Option[] = [];
    export let room: SerializedRoom;
    export let player: SerializedRoomPlayer;

    interface Option {
        label: string;
        value: string;
        uri?: string;
    }

    let invalidCountry: boolean = true;
    let selectedCountry: Option;
    let selectedDifficulty: Option;

    const checkedProfile = $profile!;

    const handleSelectCountry = async (event: CustomEvent) => {
        try {
            await axios.patch(`/api/room/${room.id}/player/${player.id}/select-country`, {
                countryId: event.detail.value,
            });
        } catch (error: any) {
            showToast(error.response.data.error, 'error');
        }
    };

    const handleSelectBotDifficulty = async (event: CustomEvent) => {
        try {
            await axios.patch(`/api/room/${room.id}/player/${player.id}/select-difficulty`, {
                difficultyId: event.detail.value,
            });
        } catch (error: any) {
            showToast(error.response.data.error, 'error');
        }
    };

    $: if (player.country) {
        selectedCountry = {
            value: player.country.id,
            label: player.country.name,
            uri: `${import.meta.env.VITE_API_BASE_URI}/api/static/country-flag/${player.country.id}?token=${localStorage.getItem('apiToken')}`,
        };
        invalidCountry =
            room.players.reduce((acc, player) => {
                return acc + !!(player.country.id === selectedCountry.value);
            }, 0) > 1;
    }

    $: if (player.bot) {
        selectedDifficulty = {
            value: player.difficulty.id,
            label: player.difficulty.name,
        };
    }
</script>

<div
    class="grid grid-cols-4 border {invalidCountry ? 'shadow-main' : ''} {player.user && checkedProfile.id === player.user.id
        ? 'border-gray-400 dark:border-gray-700'
        : 'border-gray-300 dark:border-gray-800'} rounded-xl hover:bg-gray-300 dark:hover:bg-gray-800 transition-colors duration-300 px-3 py-1"
>
    <!--    Player name & profile picture    -->
    <div class="flex gap-5 flex-wrap items-center">
        {#if player.user}
            {#if player.user.profilePicture}
                <img
                    alt={player.user.username}
                    src={`${import.meta.env.VITE_API_BASE_URI}/api/static/profile-picture/${player.user.id}?token=${localStorage.getItem('apiToken')}`}
                    class="size-10 rounded-full"
                />
            {:else}
                <img alt={player.user.username} src={import.meta.env.VITE_DEFAULT_IMAGE} class="max-h-10 rounded-full" />
            {/if}
            <p class="flex gap-1 {player.user.id === checkedProfile.id ? 'font-bold' : ''}">
                {#if room.owner.id === player.user.id}
                    <span class="text-orange-500">
                        <Icon name="crown" />
                    </span>
                {/if}
                {player.user.username}
            </p>
        {:else if player.bot}
            <img alt={player.bot.name} src={`${import.meta.env.VITE_API_BASE_URI}/api/static/bot-picture/${player.bot.id}?token=${localStorage.getItem('apiToken')}`} class="w-10 rounded-full" />
            <p class="flex gap-1">
                <span class="text-green-500">
                    <Icon name="bot" />
                </span>
                {player.bot.name}
            </p>
        {/if}
    </div>

    <!--    Player country    -->
    <div class="flex justify-center items-center">
        {#if (player.user && player.user.id === checkedProfile.id) || (player.bot && room.owner.id === checkedProfile.id)}
            <div>
                <Select name="country" bind:options={playableCountries} on:change={handleSelectCountry} bind:selectedOption={selectedCountry} />
            </div>
        {:else}
            <div class="flex gap-1.5 items-center">
                <img alt={player.country.name} src={`${import.meta.env.VITE_API_BASE_URI}/api/static/country-flag/${player.country.id}?token=${localStorage.getItem('apiToken')}`} class="max-h-10" />
                <p>{player.country.name}</p>
            </div>
        {/if}
    </div>

    <!--    Bot Difficulty    -->
    <div class="flex justify-center items-center">
        {#if room.owner.id === checkedProfile.id && player.bot}
            <div>
                <Select name="difficulty" bind:options={botDifficulties} on:change={handleSelectBotDifficulty} bind:selectedOption={selectedDifficulty} />
            </div>
        {:else if player.bot}
            <p>{player.difficulty.name}</p>
        {:else}
            <div></div>
        {/if}
    </div>

    <!--    Player actions for room owner    -->
    <div class="flex gap-3 justify-end">
        {#if player.user}
            <div class="flex items-center {player.isReady ? 'text-green-500' : 'text-red-500'}">
                <Icon name="check" size={40} />
            </div>
        {/if}
        {#if checkedProfile.id === room.owner.id && checkedProfile.id !== player.user?.id}
            <KickPlayer bind:room bind:player />
        {/if}
    </div>
</div>
