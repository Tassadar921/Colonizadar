<script lang="ts">
	import { t } from 'svelte-i18n';
	import type SerializedGame from 'colonizadar-backend/app/types/serialized/serialized_game';
	import { showToast } from '../../services/toastService';
	import type SerializedRoomPlayer from 'colonizadar-backend/app/types/serialized/serialized_room_player';
	import type SerializedselectedTerritory from 'colonizadar-backend/app/types/serialized/serialized_game_territory';
	import axios from 'axios';
	import { formatGameNumbers } from '../../services/stringService';
	import { getCentroidFromPath, setFortifiedIcon } from '../../services/gameGeometryService';
	import { onMount, tick } from 'svelte';
	import Icon from '../shared/Icon.svelte';

	export let game: SerializedGame;
	export let selectedTerritory: SerializedselectedTerritory;
	export let currentPlayer: SerializedRoomPlayer;
	export let svgElement: SVGSVGElement;

	let isButtonDisabled: boolean = false;
	let isLoading: boolean = false;
	let buttonElement: HTMLButtonElement;

	onMount(async (): Promise<void> => {
		await tick();
		const { width, height } = buttonElement.getBoundingClientRect();
		buttonElement.style.setProperty('width', `${width}px`);
		buttonElement.style.setProperty('height', `${height}px`);
	});

	const handleGraphicalUpdate = (): void => {
		const svgGroup: SVGGElement | null = document.getElementById(selectedTerritory.territory.code.toLowerCase()) as unknown as SVGGElement | null;
		const svgPath: SVGPathElement | null = svgGroup?.querySelector('.mainland') as SVGPathElement | null;
		if (!svgGroup || !svgPath) {
			return;
		}

		const ctm: DOMMatrix | null = svgPath.getCTM();
		const groupCTMInverse: DOMMatrix | undefined = svgGroup.getCTM()?.inverse();
		if (!ctm || !groupCTMInverse) {
			return;
		}

		const point: SVGPoint = getCentroidFromPath(svgPath, svgElement);
		const pointInGroup: DOMPoint = point.matrixTransform(ctm).matrixTransform(groupCTMInverse);

		setFortifiedIcon(game, pointInGroup, svgGroup);
	};

	const handleFortify = async (): Promise<void> => {
		isLoading = true;
		try {
			const { data } = await axios.patch(`/api/game/${game.id}/actions/territory/${selectedTerritory.territory.code}/fortify`);
			game = {
				...game,
				players: game.players.map((player: SerializedRoomPlayer) => {
					if (data.player.id === player.id) {
						return data.player;
					}
					return player;
				}),
				territories: game.territories.map((selectedTerritory: SerializedselectedTerritory) => {
					if (data.territory.id === selectedTerritory.id) {
						return data.territory;
					}
					return selectedTerritory;
				}),
			};
			handleGraphicalUpdate();
			showToast(data.message);
		} catch (error: any) {
			showToast(error.response.data.error, 'error');
		}
		isLoading = false;
	};

	$: isButtonDisabled = isLoading || (currentPlayer?.gold ?? 0) < game.map.fortifyCost;
</script>

<div class="flex gap-1 flex-col justify-center items-center">
	<button bind:this={buttonElement} disabled={isButtonDisabled} class="bg-green-500 hover:bg-green-600 transition-colors duration-300 px-3 py-1 rounded-xl" on:click={handleFortify}>
		{#if isLoading}
			<Icon name="spinner" />
		{:else}
			{$t('play.game.fortify')}
		{/if}
	</button>

	<p>{$t('play.game.cost')} : {formatGameNumbers(game?.map.fortifyCost ?? 0)}</p>
</div>
