import SerializedNotification from '#types/serialized/serialized_notification';

type PaginatedNotifications = {
    notifications: SerializedNotification[];
    firstPage: number;
    lastPage: number;
    perPage: number;
    total: number;
    currentPage: number;
};

export default PaginatedNotifications;
