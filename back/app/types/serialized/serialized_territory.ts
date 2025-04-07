type SerializedTerritory = {
    code: string;
    name: string;
    isCoastal: boolean;
    isFactory: boolean;
    neighbours?: SerializedTerritory[];
    createdAt?: string;
    updatedAt?: string;
};

export default SerializedTerritory;
