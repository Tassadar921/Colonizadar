import Territory from '#models/territory';

export function rollTerritoryValue(territory: Territory): number {
    const coastalBoost: number = territory.isCoastal ? 10 : 0;
    const neighbourBoost: number = Math.floor(territory.neighbours.length / 2);

    const min: number = coastalBoost + 10;
    const max: number = neighbourBoost + 30;

    return Math.ceil(Math.random() * (max - min) + min) * 100000;
}

export function rollTerritoryPower(territory: Territory, value: number): number {
    const isCoastalBoost: number = territory.isCoastal ? 30000 : 0;
    const neighbourCount: number = territory.neighbours.length;

    const base: number = value / 40000;

    const neighbourBoost: number = Math.pow(neighbourCount, 1.2) * 1500;

    const chaos: number = (Math.random() - 0.5) * 200000;

    let rawPower: number = base * 1000 + neighbourBoost + isCoastalBoost + chaos;

    const clamped: number = Math.max(1000, Math.min(350000, rawPower));
    return Math.round(clamped / 1000) * 1000;
}
