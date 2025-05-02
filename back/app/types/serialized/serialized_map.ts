import SerializedUser from '#types/serialized/serialized_user';
import SerializedTerritory from '#types/serialized/serialized_territory';

type SerializedMap = {
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
    financeWildTerritoryStep: number;
    baseSubversionCost: number;
    fortifyCost: number;
    territories: SerializedTerritory[];
    createdBy: SerializedUser;
    createdAt?: string;
    updatedAt?: string;
};

export default SerializedMap;
