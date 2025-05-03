import { inject } from '@adonisjs/core';
import FriendRepository from '#repositories/friend_repository';
import { HttpContext } from '@adonisjs/core/http';
import { searchFriendsValidator, acceptFriendValidator, refuseFriendValidator, removeFriendValidator } from '#validators/friend';
import User from '#models/user';
import PendingFriend from '#models/pending_friend';
import transmit from '@adonisjs/transmit/services/main';
import UserRepository from '#repositories/user_repository';
import PendingFriendRepository from '#repositories/pending_friend_repository';
import Friend from '#models/friend';
import cache from '@adonisjs/cache/services/main';
import PaginatedFriends from '#types/paginated/paginated_friends';

@inject()
export default class FriendController {
    constructor(
        private readonly friendRepository: FriendRepository,
        private readonly userRepository: UserRepository,
        private readonly pendingFriendRepository: PendingFriendRepository
    ) {}

    public async search({ request, response, user }: HttpContext): Promise<void> {
        const { query, page, perPage } = await request.validateUsing(searchFriendsValidator);

        return response.send({
            friends: await cache.getOrSet({
                key: `user-friends:${user.id}`,
                ttl: '5m',
                factory: async (): Promise<PaginatedFriends> => {
                    return await this.friendRepository.search(query ?? '', page ?? 1, perPage ?? 10, user);
                },
            }),
        });
    }

    public async accept({ request, response, user }: HttpContext): Promise<void> {
        const { userId } = await request.validateUsing(acceptFriendValidator);

        const askingToUser: User | null = await this.userRepository.firstOrFail({ frontId: userId });

        let pendingFriend: PendingFriend = await this.pendingFriendRepository.findOneFromUsers(user, askingToUser);

        transmit.broadcast(`notification/add-friend/accept/${userId}`, user.apiSerialize());
        await Friend.createMany([
            {
                userId: user.id,
                friendId: askingToUser.id,
            },
            {
                userId: askingToUser.id,
                friendId: user.id,
            },
        ]);
        await pendingFriend.notification.delete();
        await pendingFriend.delete();
        return response.send({ message: 'Friend added' });
    }

    public async refuse({ request, response, user }: HttpContext): Promise<void> {
        const { userId } = await request.validateUsing(refuseFriendValidator);

        const askingToUser: User | null = await this.userRepository.firstOrFail({ frontId: userId });

        let pendingFriend: PendingFriend = await this.pendingFriendRepository.findOneFromUsers(user, askingToUser);

        transmit.broadcast(`notification/add-friend/refuse/${userId}`, user.apiSerialize());
        await pendingFriend.notification.delete();
        await pendingFriend.delete();
        return response.send({ message: 'Friend request refused' });
    }

    public async remove({ request, response, user }: HttpContext): Promise<void> {
        const { userId } = await removeFriendValidator.validate(request.params());

        const friend: User | null = await this.userRepository.firstOrFail({ frontId: userId });

        const friendRelationships: Friend[] = await this.friendRepository.findFromUsers(user, friend);
        if (!friendRelationships.length) {
            return response.notFound({ error: 'You are not friend with this user' });
        }

        friendRelationships.map(async (friend: Friend): Promise<void> => {
            await friend.delete();
        });

        transmit.broadcast(`notification/friend/remove/${userId}`, user.apiSerialize());
        transmit.broadcast(`notification/friend/remove/${user.frontId}`, friend.apiSerialize());

        return response.send({ message: 'Friend removed' });
    }
}
