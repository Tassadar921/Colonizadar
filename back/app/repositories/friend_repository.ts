import BaseRepository from '#repositories/base/base_repository';
import Friend from '#models/friend';
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model';
import PaginatedFriends from '#types/paginated/paginated_friends';
import User from '#models/user';
import SerializedFriend from '#types/serialized/serialized_friend';

export default class FriendRepository extends BaseRepository<typeof Friend> {
    constructor() {
        super(Friend);
    }

    public async search(query: string, page: number, perPage: number, user: User): Promise<PaginatedFriends> {
        const friends: ModelPaginatorContract<Friend> = await this.Model.query()
            .where('user_id', user.id)
            .if(query, (queryBuilder): void => {
                queryBuilder.leftJoin('users', 'friends.friend_id', 'users.id').where('users.username', 'ILIKE', `%${query}%`);
            })
            .preload('friend', (friendQuery): void => {
                friendQuery.preload('profilePicture');
            })
            .paginate(page, perPage);

        return {
            friends: await Promise.all(
                friends.all().map((friend: Friend): SerializedFriend => {
                    return friend.apiSerialize();
                })
            ),
            firstPage: friends.firstPage,
            lastPage: friends.lastPage,
            perPage,
            total: friends.total,
            currentPage: page,
        };
    }

    public async findFromUsers(user1: User, user2: User): Promise<Friend[]> {
        return this.Model.query()
            .where((query): void => {
                query.where('userId', user1.id).andWhere('friendId', user2.id);
            })
            .orWhere((query): void => {
                query.where('userId', user2.id).andWhere('friendId', user1.id);
            });
    }

    public async findOneFromUsers(user1: User, user2: User): Promise<Friend | null> {
        return this.Model.query()
            .where((query): void => {
                query.where('userId', user1.id).andWhere('friendId', user2.id);
            })
            .orWhere((query): void => {
                query.where('userId', user2.id).andWhere('friendId', user1.id);
            })
            .first();
    }
}
