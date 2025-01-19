import BaseRepository from '#repositories/base/base_repository';
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model';
import User from '#models/user';
import SerializedFriend from '#types/serialized/serialized_friend';
import PaginatedPendingFriends from '#types/paginated/paginated_pending_friends';
import PendingFriend from '#models/pending_friend';

export default class PendingFriendRepository extends BaseRepository<typeof PendingFriend> {
    constructor() {
        super(PendingFriend);
    }

    public async search(query: string, page: number, perPage: number, user: User): Promise<PaginatedPendingFriends> {
        const pendingFriends: ModelPaginatorContract<PendingFriend> = await PendingFriend.query()
            .where('user_id', user.id)
            .if(query, (queryBuilder): void => {
                queryBuilder.leftJoin('users', 'pending_friends.friend_id', 'users.id').where('users.username', 'ILIKE', `%${query}%`);
            })
            .preload('friend')
            .paginate(page, perPage);

        return {
            pendingFriends: await Promise.all(
                pendingFriends.all().map((pendingFriend: PendingFriend): SerializedFriend => {
                    return pendingFriend.apiSerialize();
                })
            ),
            firstPage: pendingFriends.firstPage,
            lastPage: pendingFriends.lastPage,
            perPage,
            total: pendingFriends.total,
            currentPage: page,
        };
    }

    public async findOneFromUsers(userId: string, user: User): Promise<PendingFriend | null> {
        return PendingFriend.query()
            .where((query): void => {
                query.where('userId', userId).andWhere('friendId', user.id);
            })
            .orWhere((query): void => {
                query.where('userId', user.id).andWhere('friendId', userId);
            })
            .preload('friend')
            .first();
    }
}
