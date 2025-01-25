import SerializedFriend from '#types/serialized/serialized_friend';

type PaginatedFriends = {
    friends: SerializedFriend[];
    firstPage: number;
    lastPage: number;
    perPage: number;
    total: number;
    currentPage: number;
};

export default PaginatedFriends;
