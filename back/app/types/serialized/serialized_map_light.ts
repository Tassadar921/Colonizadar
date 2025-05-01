import SerializedUser from '#types/serialized/serialized_user';

type SerializedMapLight = {
    id: number;
    name: string;
    mainSeason: number;
    baseInfantryCost: number;
    baseShipCost: number;
    spyTerritoryCost: number;
    spyFortifiedTerritoryCost: number;
    spyPlayerCost: number;
    financePlayerCostFactor: number;
    financePlayerStep: number;
    baseSubversionCost: number;
    createdBy: SerializedUser;
    createdAt?: string;
    updatedAt?: string;
};

export default SerializedMapLight;
