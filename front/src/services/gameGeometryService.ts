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

export { getCentroidFromPath };
