import type SerializedGame from 'colonizadar-backend/app/types/serialized/serialized_game';
import type SerializedGameTerritory from 'colonizadar-backend/app/types/serialized/serialized_game_territory';
import type SerializedTerritory from 'colonizadar-backend/app/types/serialized/serialized_territory';

const hoverColor: string = '#ffffac';
const mountainColor: string = '#653a06';
const flashColor: string = '#ff0000';

const getPointInGroup = (mainSvgPath: SVGPathElement, svgGroup: SVGGElement, svgElement: SVGSVGElement): DOMPoint => {
    const ctm: DOMMatrix | null = mainSvgPath.getCTM();
    const groupCTMInverse: DOMMatrix | undefined = svgGroup.getCTM()?.inverse();
    if (!ctm || !groupCTMInverse) {
        throw new Error('CTM is null');
    }

    const point: SVGPoint = getCentroidFromPath(mainSvgPath, svgElement);
    return point.matrixTransform(ctm).matrixTransform(groupCTMInverse);
};

const getCentroidFromPath = (path: SVGPathElement, svgElement: SVGSVGElement, samples = 100): SVGPoint => {
    const totalLength: number = path.getTotalLength();
    let sumX: number = 0;
    let sumY: number = 0;

    for (let i = 0; i <= samples; i++) {
        const point: DOMPoint = path.getPointAtLength((i / samples) * totalLength);
        sumX += point.x;
        sumY += point.y;
    }

    const svgPoint: DOMPoint = svgElement.createSVGPoint();
    svgPoint.x = sumX / (samples + 1);
    svgPoint.y = sumY / (samples + 1);
    return svgPoint;
};

const setIcons = (svgElement: SVGSVGElement, game: SerializedGame): void => {
    svgElement?.querySelectorAll('.flag-icon').forEach((el): void => el.remove());
    svgElement?.querySelectorAll('.factory-icon').forEach((el): void => el.remove());
    svgElement?.querySelectorAll('.fortified-icon').forEach((el): void => el.remove());

    for (const gameTerritory of game.territories) {
        const svgGroup: SVGGElement | null = document.getElementById(gameTerritory.territory.code.toLowerCase()) as unknown as SVGGElement | null;
        const mainSvgPath: SVGPathElement | null = svgGroup?.querySelector('.mainland') as SVGPathElement | null;

        if (!svgGroup || !mainSvgPath) {
            continue;
        }

        setGameTerritoryIcons(game, gameTerritory, svgGroup, mainSvgPath, svgElement);
    }
};

const setGameTerritoryIcons = (game: SerializedGame, gameTerritory: SerializedGameTerritory, svgGroup: SVGGElement, mainSvgPath: SVGPathElement, svgElement: SVGSVGElement): void => {
    resetTerritoryColor(game, svgGroup);

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

    const pointInGroup: SVGPoint = getPointInGroup(mainSvgPath, svgGroup, svgElement);

    flag.setAttribute('x', String(pointInGroup.x - flagSize / 2));
    flag.setAttribute('y', String(pointInGroup.y - flagSize / 2));

    svgGroup.appendChild(flag);

    if (gameTerritory.owner) {
        if (gameTerritory.territory.isFactory) {
            setIcon(game, pointInGroup, svgGroup, 'factory-icon');
        } else if (gameTerritory.isFortified) {
            setIcon(game, pointInGroup, svgGroup, 'fortified-icon');
        }
    }
};

const setIcon = (game: SerializedGame, pointInGroup: SVGPoint, svgGroup: SVGGElement, iconName: string): void => {
    const icon: SVGImageElement = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    icon.classList.add(iconName);
    icon.setAttribute('href', `${import.meta.env.VITE_API_BASE_URL}/api/static/${game.map.id}/${iconName}?token=${localStorage.getItem('apiToken')}`);
    icon.setAttribute('width', '4');
    icon.setAttribute('height', '4');
    icon.setAttribute('x', String(pointInGroup.x));
    icon.setAttribute('y', String(pointInGroup.y - 1));
    svgGroup.appendChild(icon);
};

const handleFortifyAction = (game: SerializedGame, gameTerritory: SerializedGameTerritory): void => {
    const svgElement: SVGSVGElement = document.getElementById('map') as unknown as SVGSVGElement;
    const svgGroup: SVGGElement | null = document.getElementById(gameTerritory.territory.code.toLowerCase()) as unknown as SVGGElement | null;
    const mainPath: SVGPathElement | null = svgGroup?.querySelector('.mainland') as SVGPathElement | null;
    if (!svgGroup || !mainPath) {
        return;
    }

    const pointInGroup: SVGPoint = getPointInGroup(mainPath, svgGroup, svgElement);

    setIcon(game, pointInGroup, svgGroup, 'fortified-icon');
};

const getNeighboursGroups = (game: SerializedGame, gameTerritory: SerializedGameTerritory): { neighbours: SVGGElement[]; neighboursSet: Set<string> } => {
    const neighboursSet = new Set<string>();
    const neighbours: SVGGElement[] = [];

    gameTerritory.territory.neighbours.forEach((neighbour: SerializedTerritory): void => {
        const svgGroup: SVGGElement | null = document.getElementById(neighbour.code.toLowerCase()) as SVGGElement | null;
        if (svgGroup && !neighboursSet.has(svgGroup.id)) {
            neighboursSet.add(svgGroup.id);
            neighbours.push(svgGroup);
        }
    });

    if (gameTerritory.territory.isCoastal && gameTerritory.ships) {
        game.territories.forEach((territory: SerializedGameTerritory): void => {
            if (territory.territory.isCoastal && territory.territory.code !== gameTerritory.territory.code) {
                const svgGroup: SVGGElement | null = document.getElementById(territory.territory.code.toLowerCase()) as SVGGElement | null;
                if (svgGroup && !neighboursSet.has(svgGroup.id)) {
                    neighboursSet.add(svgGroup.id);
                    neighbours.push(svgGroup);
                }
            }
        });
    }

    return { neighbours, neighboursSet };
};

const resetTerritoryColor = (game: SerializedGame, svgGroup: SVGGElement): void => {
    const gameTerritory: SerializedGameTerritory | undefined = game.territories.find((gameTerritory: SerializedGameTerritory): boolean => {
        return gameTerritory.territory.code.toLowerCase() === svgGroup.id;
    });

    if (gameTerritory) {
        if (gameTerritory.owner) {
            svgGroup.setAttribute('fill', gameTerritory.owner.country.color);
        } else {
            svgGroup.setAttribute('fill', 'black');
        }
    }
};

const setMountainColor = (svgGroup: SVGGElement): void => {
    svgGroup.setAttribute('fill', mountainColor);
};

const setHoverColor = (svgGroup: SVGGElement): void => {
    svgGroup.setAttribute('fill', hoverColor);
};

const setFlashColor = (game: SerializedGame, svgGroup: SVGGElement, isFlashColor: boolean): void => {
    if (isFlashColor) {
        resetTerritoryColor(game, svgGroup);
    } else {
        svgGroup.setAttribute('fill', flashColor);
    }
};

export { setIcons, handleFortifyAction, getNeighboursGroups, resetTerritoryColor, setMountainColor, setHoverColor, setFlashColor };
