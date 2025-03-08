import SerializedUser from '#types/serialized/serialized_user';
import SerializedTerritory from '#types/serialized/serialized_territory';

type SerializedMap = {
    id: number;
    name: string;
    territories: SerializedTerritory[];
    createdBy: SerializedUser;
    createdAt?: string;
    updatedAt?: string;
};

export default SerializedMap;
