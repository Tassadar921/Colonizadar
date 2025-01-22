import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import { addPendingFriendValidator, getPendingFriendsValidator } from '#validators/pending_friend';
import PendingFriendRepository from '#repositories/pending_friend_repository';
import PendingFriend from '#models/pending_friend';
import transmit from '@adonisjs/transmit/services/main';
import UserRepository from '#repositories/user_repository';
import User from '#models/user';
import PendingFriendNotification from '#models/pending_friend_notification';

@inject()
export default class PendingFriendController {
    constructor(
        private readonly pendingFriendRepository: PendingFriendRepository,
        private readonly userRepository: UserRepository
    ) {}

    public async search({ request, response, user }: HttpContext): Promise<void> {
        const { query, page, perPage } = await getPendingFriendsValidator.validate(request.all());
        return response.send({
            pendingFriends: await this.pendingFriendRepository.search(query ?? '', page ?? 1, perPage ?? 10, user),
        });
    }

    public async add({ request, response, user }: HttpContext): Promise<void> {
        const { userId } = await addPendingFriendValidator.validate(request.all());

        const askingToUser: User | null = await this.userRepository.findOneBy({ frontId: Number(userId) });
        if (!askingToUser) {
            return response.notFound({ error: 'User not found' });
        }

        let pendingFriend: PendingFriend | null = await this.pendingFriendRepository.findOneFromUsers(user, askingToUser);
        let notification: PendingFriendNotification | null = null;
        if (!pendingFriend) {
            pendingFriend = await PendingFriend.create({
                userId: user.id,
                friendId: askingToUser.id,
            });
            await pendingFriend.refresh();

            notification = await PendingFriendNotification.create({
                forId: askingToUser.id,
                fromId: user.id,
                pendingFriendId: pendingFriend.id,
            });
            await notification.refresh();

            await pendingFriend.load('friend');
            await pendingFriend.load('notification', (notificationQuery): void => {
                notificationQuery.preload('from');
            });

            transmit.broadcast(`notification/add-friend/${userId}`, { notificationObject: pendingFriend.apiSerialize() });
        }

        return response.send({ pendingFriend: pendingFriend.apiSerialize() });
    }

    public async cancel({ request, response, user }: HttpContext): Promise<void> {
        const { userId } = request.params();

        const askingToUser: User | null = await this.userRepository.findOneBy({ frontId: Number(userId) });
        if (!askingToUser) {
            return response.notFound({ error: 'User not found' });
        }

        let pendingFriend: PendingFriend | null = await this.pendingFriendRepository.findOneFromUsers(user, askingToUser);
        if (!pendingFriend) {
            return response.notFound({ error: 'This pending friends request does not exist' });
        }

        if (pendingFriend.userId === user.id || pendingFriend.friendId === user.id) {
            await pendingFriend.load('friend');
            await pendingFriend.load('notification', (notificationQuery): void => {
                notificationQuery.preload('from');
            });
            transmit.broadcast(`notification/add-friend/cancel/${userId}`, { notificationObject: pendingFriend.apiSerialize() });
            await pendingFriend.notification.delete();
            await pendingFriend.delete();
            return response.send({ message: 'Request deleted' });
        }

        return response.forbidden({ error: 'You are not related to this request' });
    }
}
