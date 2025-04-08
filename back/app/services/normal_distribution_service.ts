import Territory from '#models/territory';

function normalRandom(): number {
    // Box-Muller transform to get N(0, 1)
    const u: number = Math.random();
    const v: number = Math.random();
    return Math.sqrt(-2.0 * Math.log(u)) * Math.cos(2.0 * Math.PI * v);
}

export default function rollTerritoryValue(territory: Territory): number {
    const coastalBoost: number = territory.isCoastal ? 10 : 0;
    const neighbourBoost: number = Math.floor(territory.neighbours.length / 2);

    const min: number = coastalBoost + 1;
    const max: number = neighbourBoost + 20;

    const range: number = max - min;
    const mid: number = min + range / 2;

    // Generate a normal value and clamp it into the range
    let normal: number = normalRandom(); // ~ N(0, 1)
    normal = Math.max(-3, Math.min(3, normal)); // Clamp to [-3, 3]

    // Flip distribution for "bad" territories
    const inverted: boolean = !territory.isCoastal && territory.neighbours.length < 2;

    const shifted: number = inverted ? mid + ((Math.abs(normal) * range) / 6) * (Math.random() < 0.5 ? -1 : 1) : mid + (normal * range) / 6;

    return Math.round(Math.max(min, Math.min(max, shifted)));
}
