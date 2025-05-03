type SerializedPlayableCountry = {
    id: number;
    name: string;
    color: string;
    infantryAttackFactor: number;
    infantryDefenseFactor: number;
    infantryPriceFactor: number;
    shipAttackFactor: number;
    shipDefenseFactor: number;
    shipPriceFactor: number;
    landingAttackFactor: number;
    landingDefenseFactor: number;
    createdAt?: string;
    updatedAt?: string;
};

export default SerializedPlayableCountry;
