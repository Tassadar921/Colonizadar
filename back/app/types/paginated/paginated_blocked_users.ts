import SerializedBlockedUser from '#types/serialized/serialized_blocked_user';

type PaginatedBlockedUsers = {
    blockedUsers: SerializedBlockedUser[];
    firstPage: number;
    lastPage: number;
    perPage: number;
    total: number;
    currentPage: number;
};

export default PaginatedBlockedUsers;
