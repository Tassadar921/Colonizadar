import type SerializedGame from 'colonizadar-backend/app/types/serialized/serialized_game';

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

export { getCentroidFromPath, setFactoryIcon, setFortifiedIcon };
