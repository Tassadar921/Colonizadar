import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import { addPendingFriendsValidator, getPendingFriendsValidator } from '#validators/pending_friend';
import PendingFriendRepository from '#repositories/pending_friend_repository';
import PendingFriend from '#models/pending_friend';
import transmit from '@adonisjs/transmit/services/main';
import UserRepository from '#repositories/user_repository';
import User from '#models/user';

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
        const { userId } = await addPendingFriendsValidator.validate(request.all());

        const askingToUser: User | null = await this.userRepository.findOneBy({ frontId: Number(userId) });
        if (!askingToUser) {
            return response.notFound({ error: 'User not found' });
        }

        let pendingFriend: PendingFriend | null = await this.pendingFriendRepository.findOneFromUsers(user, askingToUser);
        if (!pendingFriend) {
            pendingFriend = await PendingFriend.create({
                userId: user.id,
                friendId: askingToUser.id,
            });
            await pendingFriend.load('friend');
            await pendingFriend.refresh();
        }

        transmit.broadcast(`friend-request/${userId}`, { message: 'friends request' });
        transmit.broadcast(`notification/${userId}`, { message: 'notification' });

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
            await pendingFriend.delete();
            return response.send({ message: 'Request deleted' });
        }

        return response.forbidden({ error: 'You are not related to this request' });
    }
}
