<script lang="ts">
    import { profile } from '../../stores/profileStore';
    import { t } from 'svelte-i18n';
    import type SerializedGame from 'colonizadar-backend/app/types/serialized/serialized_game';
    import type SerializedRoomPlayer from 'colonizadar-backend/app/types/serialized/serialized_room_player';
    import Icon from '../shared/Icon.svelte';

    export let game: SerializedGame | null = null;
    export let player: SerializedRoomPlayer;
</script>

{#if player}
    <div class="ml-3 flex gap-5">
        <!--    Player country    -->
        <div class="flex justify-center items-center">
            <img alt={player.country.name} src={`${import.meta.env.VITE_API_BASE_URL}/api/static/country-flag/${player.country.id}?token=${localStorage.getItem('apiToken')}`} class="max-h-10" />
        </div>

        <!--    Player name & profile picture    -->
        <div class="flex gap-1 flex-wrap items-center">
            {#if player.user}
                {#if player.user.profilePicture}
                    <img
                        alt={player.user.username}
                        src={`${import.meta.env.VITE_API_BASE_URL}/api/static/profile-picture/${player.user.id}?token=${localStorage.getItem('apiToken')}`}
                        class="size-10 rounded-full"
                    />
                {:else}
                    <img alt={player.user.username} src={import.meta.env.VITE_DEFAULT_IMAGE} class="max-h-10 rounded-full" />
                {/if}
                <p class="flex gap-1 {player.user.id === $profile?.id ? 'font-bold' : ''}">
                    {#if game && game.owner.id === player.user.id}
                        <span class="text-orange-500">
                            <Icon name="crown" />
                        </span>
                    {/if}
                    {player.user.username}
                </p>
            {:else if player.bot}
                <img alt={player.bot.name} src={`${import.meta.env.VITE_API_BASE_URL}/api/static/bot-picture/${player.bot.id}?token=${localStorage.getItem('apiToken')}`} class="w-10 rounded-full" />
                <p class="flex gap-1">
                    <span class="text-green-500">
                        <Icon name="bot" />
                    </span>
                    {player.bot.name} ({player.difficulty.name})
                </p>
            {/if}
        </div>
    </div>
{:else}
    <p>{$t('play.game.country-modal.indigenous')}</p>
{/if}
