import BaseRepository from '#repositories/base/base_repository';
import User from '#models/user';
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model';
import PaginatedUsers from '#types/paginated/paginated_users';
import SerializedUser from '#types/serialized/serialized_user';
import UserRoleEnum from '#types/enum/user_role_enum';

export default class UserRepository extends BaseRepository<typeof User> {
    constructor() {
        super(User);
    }

    public async searchNotFriends(query: string, page: number, perPage: number, user: User): Promise<PaginatedUsers> {
        const users: ModelPaginatorContract<User> = await this.Model.query()
            .select('users.*', 'received_pending_friends.id AS receivedPendingFriendId', 'sent_pending_friends.id AS sentPendingFriendId')
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
                LEFT JOIN pending_friends AS received_pending_friends
                ON (users.id = received_pending_friends.user_id AND received_pending_friends.friend_id = ?)
              `,
                [user.id]
            )
            .joinRaw(
                `
                LEFT JOIN pending_friends AS sent_pending_friends
                ON (users.id = sent_pending_friends.friend_id AND sent_pending_friends.user_id = ?)
              `,
                [user.id]
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
                    return { ...user.apiSerialize(), receivedFriendRequest: !!user.$extras.receivedPendingFriendId, sentFriendRequest: !!user.$extras.sentPendingFriendId };
                })
            ),
            firstPage: users.firstPage,
            lastPage: users.lastPage,
            perPage,
            total: users.total,
            currentPage: page,
        };
    }

    public async getAdmin() {
        return this.Model.query().where('role', UserRoleEnum.ADMIN).firstOrFail;
    }
}
