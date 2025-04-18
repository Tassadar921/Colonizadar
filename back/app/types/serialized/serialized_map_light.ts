import SerializedUser from '#types/serialized/serialized_user';

type SerializedMapLight = {
    id: number;
    name: string;
    createdBy: SerializedUser;
    createdAt?: string;
    updatedAt?: string;
};

export default SerializedMapLight;
