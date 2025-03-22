<script>
    import Icon from '../shared/Icon.svelte';
    import { profile } from '../../stores/profileStore.js';
    import { t } from 'svelte-i18n';

    export let game;
    export let player;
</script>

{#if player}
    <div class="flex gap-5">
        <!--    Player country    -->
        <div class="flex justify-center items-center">
            <img alt={player.country.name} src={`${process.env.VITE_API_BASE_URL}/api/static/country-flag/${player.country.id}?token=${localStorage.getItem('apiToken')}`} class="max-h-10" />
        </div>

        <!--    Player name & profile picture    -->
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
                <p class="flex gap-1 {player.user.id === $profile.id ? 'font-bold' : ''}">
                    {#if game.owner.id === player.user.id}
                        <span class="text-orange-500">
                            <Icon name="crown" />
                        </span>
                    {/if}
                    {player.user.username}
                </p>
            {:else if player.bot}
                <img alt={player.bot.name} src={`${process.env.VITE_API_BASE_URL}/api/static/bot-picture/${player.bot.id}?token=${localStorage.getItem('apiToken')}`} class="w-10 rounded-full" />
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
