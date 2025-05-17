import type SerializedGame from 'colonizadar-backend/app/types/serialized/serialized_game';
import type SerializedGameTerritory from 'colonizadar-backend/app/types/serialized/serialized_game_territory';

const hoverColor: string = '#ffffac';
const mountainColor: string = '#653a06';

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

const setIcons = (game: SerializedGame, gameTerritory: SerializedGameTerritory, svgGroup: SVGGElement, mainSvgPath: SVGPathElement, svgElement: SVGSVGElement): void => {
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
            setFactoryIcon(game, pointInGroup, svgGroup);
        } else if (gameTerritory.isFortified) {
            setFortifiedIcon(game, pointInGroup, svgGroup);
        }
    }
};

const setFactoryIcon = (game: SerializedGame, pointInGroup: SVGPoint, svgGroup: SVGGElement): void => {
    const factoryIcon: SVGImageElement = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    factoryIcon.classList.add('factory-icon');
    factoryIcon.setAttribute('href', `${import.meta.env.VITE_API_BASE_URL}/api/static/${game.map.id}/factory-icon?token=${localStorage.getItem('apiToken')}`);
    factoryIcon.setAttribute('width', '4');
    factoryIcon.setAttribute('height', '4');
    factoryIcon.setAttribute('x', String(pointInGroup.x));
    factoryIcon.setAttribute('y', String(pointInGroup.y - 1));
    svgGroup.appendChild(factoryIcon);
};

const handleFortifyAction = (game: SerializedGame, gameTerritory: SerializedGameTerritory): void => {
    const svgElement: SVGSVGElement = document.getElementById('map') as unknown as SVGSVGElement;
    const svgGroup: SVGGElement | null = document.getElementById(gameTerritory.territory.code.toLowerCase()) as unknown as SVGGElement | null;
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

const setFortifiedIcon = (game: SerializedGame, pointInGroup: SVGPoint, svgGroup: SVGGElement): void => {
    const fortifiedIcon: SVGImageElement = document.createElementNS('http://www.w3.org/2000/svg', 'image');
    fortifiedIcon.classList.add('fortified-icon');
    fortifiedIcon.setAttribute('href', `${import.meta.env.VITE_API_BASE_URL}/api/static/${game.map.id}/fortified-icon?token=${localStorage.getItem('apiToken')}`);
    fortifiedIcon.setAttribute('width', '4');
    fortifiedIcon.setAttribute('height', '4');
    fortifiedIcon.setAttribute('x', String(pointInGroup.x));
    fortifiedIcon.setAttribute('y', String(pointInGroup.y - 1));
    svgGroup.appendChild(fortifiedIcon);
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

export { getCentroidFromPath, setIcons, setFactoryIcon, handleFortifyAction, setFortifiedIcon, resetTerritoryColor, setMountainColor, setHoverColor };
