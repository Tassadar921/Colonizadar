import SerializedUser from '#types/serialized/serialized_user';

type PaginatedUsers = {
    users: SerializedUser[];
    firstPage: number;
    lastPage: number;
    perPage: number;
    total: number;
    currentPage: number;
};

export default PaginatedUsers;
