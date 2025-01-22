import SerializedUser from '#types/serialized/serialized_user';
import SerializedPendingFriendNotification from "#types/serialized/serialized_pending_friend_notification";

type SerializedPendingFriend = {
    id: number;
    friend: SerializedUser;
    notification: SerializedPendingFriendNotification;
    createdAt?: string;
    updatedAt?: string;
};

export default SerializedPendingFriend;
