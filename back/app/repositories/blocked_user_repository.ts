import BaseRepository from '#repositories/base/base_repository';
import BlockedUser from '#models/blocked_user';
import User from '#models/user';
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model';
import PaginatedBlockedUsers from '#types/paginated/paginated_blocked_users';
import SerializedBlockedUser from '#types/serialized/serialized_blocked_user';

export default class BlockedUserRepository extends BaseRepository<typeof BlockedUser> {
    constructor() {
        super(BlockedUser);
    }

    public async search(query: string, page: number, perPage: number, user: User): Promise<PaginatedBlockedUsers> {
        const blockedUsers: ModelPaginatorContract<BlockedUser> = await this.Model.query()
            .where('blocker_id', user.id)
            .if(query, (queryBuilder): void => {
                queryBuilder.leftJoin('users', 'blocked_users.blocked_id', 'users.id').andWhere('users.username', 'ILIKE', `%${query}%`);
            })
            .preload('blocked')
            .paginate(page, perPage);

        return {
            blockedUsers: await Promise.all(
                blockedUsers.all().map((blockedUser: BlockedUser): SerializedBlockedUser => {
                    return blockedUser.apiSerialize();
                })
            ),
            firstPage: blockedUsers.firstPage,
            lastPage: blockedUsers.lastPage,
            perPage,
            total: blockedUsers.total,
            currentPage: page,
        };
    }

    public async findFromUsers(user: User, otherUser: User): Promise<BlockedUser[]> {
        return this.Model.query()
            .where((query): void => {
                query.where('blockerId', user.id).andWhere('blockedId', otherUser.id);
            })
            .orWhere((query): void => {
                query.where('blockerId', otherUser.id).andWhere('blockedId', user.id);
            });
    }
}
