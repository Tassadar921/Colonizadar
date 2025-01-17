import SerializedUser from '#types/serialized/serialized_user';

type SerializedFriend = {
    id: number;
    friend: SerializedUser;
    createdAt?: string;
    updatedAt?: string;
};

export default SerializedFriend;
