import SerializedUser from '#types/serialized/serialized_user';
import NotificationTypeEnum from '#types/enum/notification_type_enum';

type SerializedPendingFriendNotification = {
    id: number;
    seen: boolean;
    from: SerializedUser;
    type: NotificationTypeEnum.PENDING_FRIEND;
    createdAt?: string;
    updatedAt?: string;
};

export default SerializedPendingFriendNotification;
