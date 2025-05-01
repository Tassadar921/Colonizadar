<script lang="ts">
	import WorldMap from './WorldMap.svelte';
	import { onMount } from 'svelte';
	import Modal from '../shared/Modal.svelte';
	import Subtitle from '../shared/Subtitle.svelte';
	import { t } from 'svelte-i18n';
	import InGamePlayer from './InGamePlayer.svelte';
	import { formatGameNumbers } from '../../services/stringService';
	import type SerializedGame from 'colonizadar-backend/app/types/serialized/serialized_game';
	import type SerializedGameTerritory from 'colonizadar-backend/app/types/serialized/serialized_game_territory';
	import type SerializedRoomPlayer from 'colonizadar-backend/app/types/serialized/serialized_room_player';
	import { getCentroidFromPath } from '../../services/gameGeometryService';
	import SpyTerritory from './SpyTerritory.svelte';
	import { profile } from '../../stores/profileStore';

	export let game: SerializedGame;

	let width: number = 500;
	let height: number = 300;
	let offsetX: number = 0;
	let offsetY: number = 0;

	let viewBox: string = '';
	let svgElement: SVGSVGElement;
	let minZoomLevel: number = 1;
	let maxZoomLevel: number = 15;
	let zoomLevel: number = minZoomLevel;
	let isDragging: boolean = false;
	let startX: number = 0;
	let startY: number = 0;
	let hasDragged: boolean = false;

	const dragSensitivity: number = 1.3;

	let selectedTerritoryOwner: SerializedRoomPlayer;
	let selectedTerritory: SerializedGameTerritory;

	let showCountryModal: boolean = false;

	let hoverColor: string = '#ffffac';
	let mountainColor: string = '#653a06';

	const checkedProfile = $profile!;

	onMount(() => {
		svgElement.classList.add('rounded-lg', 'bg-blue-950', 'border', 'border-black', 'dark:border-white', 'box-content');

		handleResize();
		window.addEventListener('resize', handleResize);
		document.querySelectorAll('.mainland').forEach((path): void => {
			const svgGroup = path.parentElement! as unknown as SVGGElement;
			if (svgGroup.classList.contains('mountain')) {
				svgGroup.setAttribute('fill', mountainColor);
				return;
			}

			svgGroup.addEventListener('click', () => handleClick(svgGroup.id));
			svgGroup.addEventListener('mouseover', () => handleHover(svgGroup));
			svgGroup.addEventListener('mouseout', () => handleBlur(svgGroup));
		});

		return (): void => {
			window.removeEventListener('resize', handleResize);

			document.querySelectorAll('.mainland').forEach((path): void => {
				const svgGroup = path.parentElement! as unknown as SVGGElement;

				path.removeEventListener('click', () => handleClick(svgGroup.id));
				path.removeEventListener('mouseover', () => handleHover(svgGroup));
				path.removeEventListener('mouseout', () => handleBlur(svgGroup));
			});
		};
	});

	const handleResize = (): void => {
		viewBox = `${offsetX} ${offsetY} ${width} ${height}`;
	};

	const zoom = (delta: number, cursorX: number, cursorY: number): void => {
		const svgRect = svgElement.getBoundingClientRect();

		const mouseX: number = cursorX - svgRect.left;
		const mouseY: number = cursorY - svgRect.top;

		const svgX: number = offsetX + (mouseX / svgRect.width) * (width / zoomLevel);
		const svgY: number = offsetY + (mouseY / svgRect.height) * (height / zoomLevel);

		zoomLevel *= delta;
		zoomLevel = Math.max(minZoomLevel, Math.min(maxZoomLevel, zoomLevel));

		const newViewboxWidth: number = width / zoomLevel;
		const newViewboxHeight: number = height / zoomLevel;

		offsetX = svgX - (mouseX / svgRect.width) * newViewboxWidth;
		offsetY = svgY - (mouseY / svgRect.height) * newViewboxHeight;

		viewBox = `${offsetX} ${offsetY} ${newViewboxWidth} ${newViewboxHeight}`;
	};

	const handleWheel = (event: WheelEvent): void => {
		event.preventDefault();
		const delta: number = event.deltaY > 0 ? 0.9 : 1.1;
		zoom(delta, event.clientX, event.clientY);
	};

	const startDrag = (event: MouseEvent): void => {
		isDragging = true;
		hasDragged = false;
		startX = event.clientX;
		startY = event.clientY;
	};

	const onDrag = (event: MouseEvent): void => {
		if (!isDragging) {
			return;
		}

		hasDragged = true;

		offsetX -= (event.clientX - startX) / (zoomLevel * dragSensitivity);
		offsetY -= (event.clientY - startY) / (zoomLevel * dragSensitivity);

		const viewboxWidth: number = width / zoomLevel;
		const viewboxHeight: number = height / zoomLevel;

		startX = event.clientX;
		startY = event.clientY;

		viewBox = `${offsetX} ${offsetY} ${viewboxWidth} ${viewboxHeight}`;
	};

	const endDrag = (): void => {
		isDragging = false;
	};

	const handleClick = (territoryId: string): void => {
		if (!hasDragged && territoryId) {
			const filteredTerritories: SerializedGameTerritory[] = game.territories.filter((gameTerritory): boolean => {
				return gameTerritory.territory.code.toLowerCase() === territoryId;
			});
			if (filteredTerritories.length > 0) {
				selectedTerritory = filteredTerritories[0];
				selectedTerritoryOwner = selectedTerritory.owner;
				showCountryModal = true;
			}
		}
	};

	const handleHover = (svgGroup: SVGGElement): void => {
		svgGroup.setAttribute('fill', hoverColor);
	};

	const handleBlur = (svgGroup: SVGGElement): void => {
		if (showCountryModal) {
			return;
		}

		resetTerritoryColor(svgGroup!);
	};

	const resetTerritoryColor = (svgGroup: SVGGElement): void => {
		const filteredTerritories = game.territories.filter((gameTerritory): boolean => {
			return gameTerritory.territory.code.toLowerCase() === svgGroup.id;
		});
		if (filteredTerritories.length > 0) {
			if (filteredTerritories[0].owner) {
				svgGroup.setAttribute('fill', filteredTerritories[0].owner.country.color);
			} else {
				svgGroup.setAttribute('fill', 'black');
			}
		}
	};

	$: if (selectedTerritory) {
		const svgGroup = document.getElementById(selectedTerritory.territory.code.toLowerCase()) as unknown as SVGGElement;
		if (svgGroup) {
			if (showCountryModal) {
				svgGroup.setAttribute('fill', hoverColor);
			} else {
				resetTerritoryColor(svgGroup);
			}
		}
	}

	$: if (game) {
		svgElement?.querySelectorAll('.flag-icon').forEach((el) => el.remove());

		for (const gameTerritory of game.territories) {
			const svgGroup: SVGGElement | null = document.getElementById(gameTerritory.territory.code.toLowerCase()) as unknown as SVGGElement | null;
			const svgPath: SVGPathElement | null = svgGroup?.querySelector('.mainland') as SVGPathElement | null;

			if (!svgGroup || !svgPath) {
				continue;
			}

			resetTerritoryColor(svgGroup);

			const point: SVGPoint = getCentroidFromPath(svgPath, svgElement);

			const ctm: DOMMatrix | null = svgPath.getCTM();
			const groupCTMInverse: DOMMatrix | undefined = svgGroup.getCTM()?.inverse();
			if (!ctm || !groupCTMInverse) {
				continue;
			}

			const pointInGroup: DOMPoint = point.matrixTransform(ctm).matrixTransform(groupCTMInverse);

			const flag: SVGImageElement = document.createElementNS('http://www.w3.org/2000/svg', 'image');
			flag.classList.add('flag-icon');

			if (gameTerritory.owner) {
				flag.setAttribute('href', `${import.meta.env.VITE_API_BASE_URL}/api/static/country-flag/${gameTerritory.owner.country.id}?token=${localStorage.getItem('apiToken')}`);
			} else {
				flag.setAttribute('href', `${import.meta.env.VITE_API_BASE_URL}/api/static/country-flag/${game.map.id}/neutral-flag?token=${localStorage.getItem('apiToken')}`);
			}

			const flagSize = 8;

			flag.setAttribute('width', String(flagSize));
			flag.setAttribute('height', String(flagSize));

			flag.setAttribute('x', String(pointInGroup.x - flagSize / 2));
			flag.setAttribute('y', String(pointInGroup.y - flagSize / 2));

			svgGroup.appendChild(flag);

			if (gameTerritory.owner) {
				if (gameTerritory.territory.isFactory) {
					const factoryIcon: SVGImageElement = document.createElementNS('http://www.w3.org/2000/svg', 'image');
					factoryIcon.classList.add('fortified-icon');
					factoryIcon.setAttribute('href', `${import.meta.env.VITE_API_BASE_URL}/api/static/${game.map.id}/factory-icon?token=${localStorage.getItem('apiToken')}`);
					factoryIcon.setAttribute('width', '4');
					factoryIcon.setAttribute('height', '4');
					factoryIcon.setAttribute('x', String(pointInGroup.x));
					factoryIcon.setAttribute('y', String(pointInGroup.y - 1));
					svgGroup.appendChild(factoryIcon);
				} else if (gameTerritory.isFortified) {
					const fortifiedIcon: SVGImageElement = document.createElementNS('http://www.w3.org/2000/svg', 'image');
					fortifiedIcon.classList.add('fortified-icon');
					fortifiedIcon.setAttribute('href', `${import.meta.env.VITE_API_BASE_URL}/api/static/${game.map.id}/fortified-icon?token=${localStorage.getItem('apiToken')}`);
					fortifiedIcon.setAttribute('width', '4');
					fortifiedIcon.setAttribute('height', '4');
					fortifiedIcon.setAttribute('x', String(pointInGroup.x));
					fortifiedIcon.setAttribute('y', String(pointInGroup.y - 1));
					svgGroup.appendChild(fortifiedIcon);
				}
			}
		}
	}
</script>

<button
	class="w-4/5 overflow-hidden {isDragging ? 'cursor-grabbing' : 'cursor-pointer'}"
	on:wheel={handleWheel}
	on:mousedown={startDrag}
	on:mousemove={onDrag}
	on:mouseup={endDrag}
	on:mouseleave={endDrag}
	aria-label="Interactive world map"
>
	<WorldMap bind:svgElement bind:viewBox />
</button>

{#if selectedTerritory}
	<Modal bind:showModal={showCountryModal}>
		<Subtitle slot="header">{selectedTerritory.territory.name}</Subtitle>
		<div class="flex gap-1 items-center">
			<p>{$t('play.game.country-modal.owner')} :</p>
			<InGamePlayer bind:game bind:player={selectedTerritoryOwner} />
		</div>
		<p>{$t('play.game.country-modal.value')} : {formatGameNumbers(selectedTerritory.value ?? 0)}</p>
		<p>{$t('play.common.infantry')} : {selectedTerritory.infantry ? formatGameNumbers(selectedTerritory.infantry) : '???'}</p>
		{#if selectedTerritory && selectedTerritoryOwner && selectedTerritory.territory.isCoastal}
			<p>{$t('play.common.ships')} : {selectedTerritory.ships ? formatGameNumbers(selectedTerritory.ships) : '???'}</p>
		{/if}
		<div class="flex gap-5 justify-center">
			{#if game.map.mainSeason === game.season && selectedTerritory && selectedTerritoryOwner?.user?.id !== checkedProfile.id}
				<SpyTerritory bind:game bind:selectedTerritory />
			{/if}
		</div>
	</Modal>
{/if}
