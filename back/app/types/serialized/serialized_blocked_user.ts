import SerializedUser from '#types/serialized/serialized_user';

type SerializedBlockedUser = {
    id: number;
    user: SerializedUser;
    createdAt?: string;
    updatedAt?: string;
};

export default SerializedBlockedUser;
