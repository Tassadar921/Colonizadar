import SerializedUser from '#types/serialized/serialized_user';

type SerializedPendingFriend = {
    id: number;
    friend: SerializedUser;
    createdAt?: string;
    updatedAt?: string;
};

export default SerializedPendingFriend;
