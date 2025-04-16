type SerializedPlayableCountry = {
    id: number;
    name: string;
    color: string;
    infantryAttack: number;
    infantryDefense: number;
    infantryPrice: number;
    shipAttack: number;
    shipDefense: number;
    shipPrice: number;
    landingAttack: number;
    landingDefense: number;
    createdAt?: string;
    updatedAt?: string;
};

export default SerializedPlayableCountry;
