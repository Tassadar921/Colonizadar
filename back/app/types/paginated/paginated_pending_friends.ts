import SerializedFriend from '#types/serialized/serialized_friend';

type PaginatedPendingFriends = {
    pendingFriends: SerializedFriend[];
    firstPage: number;
    lastPage: number;
    perPage: number;
    total: number;
    currentPage: number;
};

export default PaginatedPendingFriends;
