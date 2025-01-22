import { inject } from '@adonisjs/core';
import FriendRepository from '#repositories/friend_repository';
import { HttpContext } from '@adonisjs/core/http';
import { getFriendsValidator } from '#validators/friend';
import User from '#models/user';
import PendingFriend from '#models/pending_friend';
import transmit from '@adonisjs/transmit/services/main';
import UserRepository from '#repositories/user_repository';
import PendingFriendRepository from '#repositories/pending_friend_repository';
import Friend from '#models/friend';

@inject()
export default class FriendsController {
    constructor(
        private readonly friendRepository: FriendRepository,
        private readonly userRepository: UserRepository,
        private readonly pendingFriendRepository: PendingFriendRepository
    ) {}

    public async search({ request, response, user }: HttpContext): Promise<void> {
        const { query, page, perPage } = await getFriendsValidator.validate(request.all());
        return response.send({
            friends: await this.friendRepository.search(query ?? '', page ?? 1, perPage ?? 10, user),
        });
    }

    public async add({ request, response, user }: HttpContext): Promise<void> {
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
            transmit.broadcast(`notification/add-friend/confirm/${userId}`);
            await Friend.createMany([
                {
                    userId: pendingFriend.userId,
                    friendId: pendingFriend.friendId,
                },
                {
                    userId: pendingFriend.friendId,
                    friendId: pendingFriend.userId,
                },
            ]);
            await pendingFriend.notification.delete();
            await pendingFriend.delete();
            return response.send({ message: 'Friend added' });
        }

        return response.forbidden({ error: 'You have no pending request from this user' });
    }
}
