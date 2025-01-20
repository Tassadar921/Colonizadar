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
            .select('users.*', 'pending_friends.id AS pendingFriendId')
            .joinRaw(
                `
                LEFT JOIN blocked_users AS blocked
                ON (users.id = blocked.blocked_id AND blocked.blocker_id = ?)
                OR (users.id = blocked.blocker_id AND blocked.blocked_id = ?)
              `,
                [user.id, user.id]
            )
            .joinRaw(
                `
                LEFT JOIN friends
                ON users.id = friends.friend_id AND friends.user_id = ?
              `,
                [user.id]
            )
            .joinRaw(
                `
                LEFT JOIN pending_friends AS pending_friends
                ON (users.id = pending_friends.user_id AND pending_friends.friend_id = ?)
                OR (users.id = pending_friends.friend_id AND pending_friends.user_id = ?)
              `,
                [user.id, user.id]
            )
            .if(query, (queryBuilder): void => {
                queryBuilder.where('users.username', 'ILIKE', `%${query}%`);
            })
            .whereNull('blocked.blocker_id')
            .whereNull('friends.user_id')
            .whereNot('users.id', user.id)
            .preload('profilePicture')
            .paginate(page, perPage);

        return {
            users: await Promise.all(
                users.all().map((user: User): SerializedUser => {
                    return { ...user.apiSerialize(), friendRequested: !!user.$extras.pendingFriendId };
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
