import BaseRepository from '#repositories/base/base_repository';
import User from '#models/user';
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model';
import PaginatedUsers from '#types/paginated/paginated_users';
import SerializedUser from '#types/serialized/serialized_user';

export default class UserRepository extends BaseRepository<typeof User> {
    constructor() {
        super(User);
    }

    public async searchNotFriends(query: string, page: number, perPage: number, user: User): Promise<PaginatedUsers> {
        const users: ModelPaginatorContract<User> = await User.query()
            .select('users.*')
            .leftJoin('blocked_users', 'users.id', 'blocked_users.blocked_id')
            .leftJoin('friends', 'users.id', 'friends.user_id')
            .if(query, (queryBuilder): void => {
                queryBuilder.where('users.username', 'ILIKE', `%${query}%`);
            })
            .whereNot('blocked_users.blocker_id', user.id)
            .andWhereNot('blocked_users.blocked_id', user.id)
            .andWhereNot('friends.user_id', user.id)
            .andWhereNot('friends.friend_id', user.id)
            .paginate(page, perPage);

        return {
            users: await Promise.all(
                users.all().map((user: User): SerializedUser => {
                    return user.apiSerialize();
                })
            ),
            firstPage: users.firstPage,
            lastPage: users.lastPage,
            perPage,
            total: users.total,
            currentPage: page,
        };
    }
}
