<script lang="ts">
    import Map from '../game/Map.svelte';
    import { onDestroy, onMount } from 'svelte';
    import axios from 'axios';
    import { showToast } from '../../services/toastService';
    import { navigate } from '../../stores/locationStore';
    import Title from '../shared/Title.svelte';
    import type SerializedGame from 'colonizadar-backend/app/types/serialized/serialized_game';
    import SideGamePlayer from '../game/SideGamePlayer.svelte';
    import { t } from 'svelte-i18n';
    import type SerializedRoomPlayer from 'colonizadar-backend/app/types/serialized/serialized_room_player';
    import { profile } from '../../stores/profileStore';
    import { formatGameNumbers, formatSeasonFromNumber } from '../../services/stringService';
    import GameNotifications from '../game/GameNotifications.svelte';
    import type SerializedGameTerritory from 'colonizadar-backend/app/types/serialized/serialized_game_territory';
    import { updateGameOnLoad } from '../../stores/dbStore';
    import { MetaTags } from 'svelte-meta-tags';
    import GameReady from '../game/GameReady.svelte';
    import { location } from '../../stores/locationStore';
    import { language } from '../../stores/languageStore';

    export let gameId: string;

    let game: SerializedGame;
    let heartbeat: NodeJS.Timeout;
    let currentPlayer: SerializedRoomPlayer;
    let selectedTerritoryOwner: SerializedRoomPlayer;
    let selectedTerritory: SerializedGameTerritory;

    onMount(async (): Promise<void> => {
        try {
            const { data } = await axios.get(`/api/game/${gameId}`);
            game = data;
            await updateGameOnLoad(game);
            heartbeat = setInterval(async () => {
                try {
                    await axios.patch(`/api/game/${gameId}/heartbeat`);
                } catch (e) {
                    // navigate('/play');
                }
            }, 2000);
        } catch (error: any) {
            showToast(error.response.data.error, 'error');
            navigate('/play');
        }
    });

    const handleTerritoryUpdate = (event: CustomEvent): void => {
        if (event.detail.id === selectedTerritory?.id) {
            selectedTerritory = event.detail;
            selectedTerritoryOwner = event.detail.owner;
        }
    };

    onDestroy((): void => {
        if (heartbeat) {
            clearInterval(heartbeat);
        }
    });

    $: if (game) {
        currentPlayer = game.players.find((player: SerializedRoomPlayer) => player.user?.id === $profile!.id);
    }
</script>

<MetaTags
    title={$t('play.game.meta.title')}
    description={$t('play.game.meta.description')}
    keywords={$t('play.game.meta.keywords').split(', ')}
    languageAlternates={[
        {
            hrefLang: 'en',
            href: `${import.meta.env.VITE_FRONT_URI}/en/play/game/${gameId}`,
        },
        {
            hrefLang: 'fr',
            href: `${import.meta.env.VITE_FRONT_URI}/fr/play/game/${gameId}`,
        },
    ]}
    openGraph={{
        type: 'website',
        title: $t('play.game.meta.title'),
        description: $t('play.game.meta.description'),
        images: [
            {
                url: `${import.meta.env.VITE_FRONT_URI}/assets/logo-1200x1200.webp`,
                width: 1200,
                height: 1200,
                alt: `open-graph.logo.alt`,
            },
        ],
        url: `${import.meta.env.VITE_FRONT_URI}${$location}`,
        locale: $language,
        siteName: 'Colonizadar',
    }}
/>

<Title title={game?.name} />

{#if game && currentPlayer}
    <GameNotifications bind:game bind:currentPlayer on:territoryUpdate={handleTerritoryUpdate} />
    <div class="flex gap-3 justify-between">
        <div class="w-1/3">
            <p>{$t('play.game.gold')}: {formatGameNumbers(currentPlayer.gold ?? 0)}</p>
            <p>{$t(`play.game.${formatSeasonFromNumber(game.season)}`)}: {game.year}</p>
        </div>
        <div class="w-1/3 flex justify-center items-center">
            <GameReady {game} {currentPlayer} />
        </div>
        <div class="w-1/3"></div>
    </div>
{/if}

<!-- Do not include in the if game, to load the svg in parallel of the back request to get the data -->
<div class="flex gap-5 justify-center items-center">
    <div class="flex flex-col">
        {#each game?.players.slice(0, game?.players.length / 2) as player, index (player.id)}
            <div class:border-b={index < game.players.length / 2 - 1} class="border-b-gray-500">
                <SideGamePlayer bind:game {currentPlayer} {player} />
            </div>
        {/each}
    </div>
    <Map bind:game {currentPlayer} bind:selectedTerritory bind:selectedTerritoryOwner />
    <div class="flex flex-col">
        {#each game?.players.slice(game?.players.length / 2) as player, index (player.id)}
            <div class:border-b={index < game.players.length / 2 - 1} class="border-b-gray-500">
                <SideGamePlayer bind:game {currentPlayer} {player} />
            </div>
        {/each}
    </div>
</div>
