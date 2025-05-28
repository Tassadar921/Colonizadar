<script lang="ts">
    import Map from '../game/Map.svelte';
    import { onMount } from 'svelte';
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

    export let gameId: string;

    let game: SerializedGame;
    let currentPlayer: SerializedRoomPlayer;
    let selectedTerritoryOwner: SerializedRoomPlayer;
    let selectedTerritory: SerializedGameTerritory;

    onMount(async (): Promise<void> => {
        try {
            const { data } = await axios.get(`/api/game/${gameId}`);
            game = data;
            await updateGameOnLoad(game);
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
/>

<Title title={game?.name} />

{#if game && currentPlayer}
    <GameNotifications bind:game bind:currentPlayer on:territoryUpdate={handleTerritoryUpdate} />
    <p>{$t('play.game.gold')}: {formatGameNumbers(currentPlayer.gold ?? 0)}</p>
    <p>{$t('play.game.year')}: {game.year}</p>
    <p>{$t('play.game.season')}: {$t(`play.game.${formatSeasonFromNumber(game.season)}`)}</p>
{/if}

<!-- TODO: faire en sorte que ça soit présentable pour 2, 4, 6 (idéalement 8 ou même 10 mais pas sûr d'avoir la place) -->
<!-- Do not include in the if game, to load the svg in parallel of the back request to get the data -->
<div class="flex gap-5 justify-center items-center">
    <div class="flex flex-col">
        {#each game?.players.slice(0, game?.players.length / 2) as player (player.id)}
            <SideGamePlayer bind:game {currentPlayer} {player} />
        {/each}
    </div>
    <Map bind:game {currentPlayer} bind:selectedTerritory bind:selectedTerritoryOwner />
    <div class="flex flex-col">
        {#each game?.players.slice(game?.players.length / 2) as player (player.id)}
            <SideGamePlayer bind:game {currentPlayer} {player} />
        {/each}
    </div>
</div>
