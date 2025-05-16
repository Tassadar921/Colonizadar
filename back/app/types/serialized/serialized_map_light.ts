import SerializedUser from '#types/serialized/serialized_user';

type SerializedMapLight = {
    id: number;
    name: string;
    mainSeason: number;
    baseInfantryCost: number;
    baseShipCost: number;
    spyTerritoryCost: number;
    spyFortifiedTerritoryCost: number;
    spyFactoryCost: number;
    spyPlayerCost: number;
    financePlayerCostFactor: number;
    financePlayerStep: number;
    financeWildTerritoryStep: number;
    subvertCost: number;
    fortifyCost: number;
    createdBy: SerializedUser;
    createdAt?: string;
    updatedAt?: string;
};

export default SerializedMapLight;
