import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import { searchPendingFriendsValidator, addPendingFriendValidator, cancelPendingFriendValidator } from '#validators/pending_friend';
import PendingFriendRepository from '#repositories/pending_friend_repository';
import PendingFriend from '#models/pending_friend';
import transmit from '@adonisjs/transmit/services/main';
import UserRepository from '#repositories/user_repository';
import User from '#models/user';
import PendingFriendNotification from '#models/pending_friend_notification';
import cache from '@adonisjs/cache/services/main';
import PaginatedPendingFriends from '#types/paginated/paginated_pending_friends';

@inject()
export default class PendingFriendController {
    constructor(
        private readonly pendingFriendRepository: PendingFriendRepository,
        private readonly userRepository: UserRepository
    ) {}

    public async search({ request, response, user }: HttpContext): Promise<void> {
        const { query, page, perPage } = await request.validateUsing(searchPendingFriendsValidator);

        return response.send({
            pendingFriends: await cache.getOrSet({
                key: `pending-friends:${user.id}`,
                ttl: '5m',
                factory: async (): Promise<PaginatedPendingFriends> => {
                    return await this.pendingFriendRepository.search(query ?? '', page ?? 1, perPage ?? 10, user);
                },
            }),
        });
    }

    public async add({ request, response, user }: HttpContext): Promise<void> {
        const { userId } = await request.validateUsing(addPendingFriendValidator);

        const askingToUser: User = await this.userRepository.firstOrFail({ frontId: userId });

        let pendingFriend: PendingFriend | null;

        try {
            pendingFriend = await this.pendingFriendRepository.findOneFromUsers(user, askingToUser);
        } catch (error: any) {
            pendingFriend = await PendingFriend.create({
                userId: user.id,
                friendId: askingToUser.id,
            });
            await pendingFriend.refresh();

            await PendingFriendNotification.create({
                forId: askingToUser.id,
                fromId: user.id,
                pendingFriendId: pendingFriend.id,
            });

            await pendingFriend.load('friend');
            await pendingFriend.load('notification', (notificationQuery): void => {
                notificationQuery.preload('from');
            });

            transmit.broadcast(`notification/add-friend/${userId}`, pendingFriend.apiSerialize());
        }

        return response.send({ pendingFriend: pendingFriend.apiSerialize() });
    }

    public async cancel({ request, response, user }: HttpContext): Promise<void> {
        const { userId } = await cancelPendingFriendValidator.validate(request.params());

        const askingToUser: User = await this.userRepository.firstOrFail({ frontId: userId });

        const pendingFriend: PendingFriend = await this.pendingFriendRepository.findOneFromUsers(user, askingToUser);

        if (pendingFriend.userId === user.id || pendingFriend.friendId === user.id) {
            transmit.broadcast(`notification/add-friend/cancel/${userId}`, pendingFriend.apiSerialize());
            await pendingFriend.notification.delete();
            await pendingFriend.delete();

            return response.send({ message: 'Request deleted' });
        }

        return response.forbidden({ error: 'You are not related to this request' });
    }
}
