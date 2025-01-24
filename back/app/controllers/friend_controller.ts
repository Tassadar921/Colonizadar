import { inject } from '@adonisjs/core';
import FriendRepository from '#repositories/friend_repository';
import { HttpContext } from '@adonisjs/core/http';
import { acceptFriendValidator, getFriendsValidator, refuseFriendValidator } from '#validators/friend';
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

    public async accept({ request, response, user }: HttpContext): Promise<void> {
        const { userId } = await acceptFriendValidator.validate(request.all());

        const askingToUser: User | null = await this.userRepository.findOneBy({ frontId: Number(userId) });
        if (!askingToUser) {
            return response.notFound({ error: 'User not found' });
        }

        let pendingFriend: PendingFriend | null = await this.pendingFriendRepository.findOneFromUsers(user, askingToUser);
        if (!pendingFriend) {
            return response.notFound({ error: 'This pending friends request does not exist' });
        }

        transmit.broadcast(`notification/add-friend/accept/${askingToUser.frontId}`, user.apiSerialize());
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
        const { userId } = await refuseFriendValidator.validate(request.all());

        const askingToUser: User | null = await this.userRepository.findOneBy({ frontId: Number(userId) });
        if (!askingToUser) {
            return response.notFound({ error: 'User not found' });
        }

        let pendingFriend: PendingFriend | null = await this.pendingFriendRepository.findOneFromUsers(user, askingToUser);
        if (!pendingFriend) {
            return response.notFound({ error: 'This pending friends request does not exist' });
        }

        transmit.broadcast(`notification/add-friend/refuse/${user.frontId}`, askingToUser.apiSerialize());
        await pendingFriend.notification.delete();
        await pendingFriend.delete();
        return response.send({ message: 'Friend request refused' });
    }

    public async remove({ request, response, user }: HttpContext): Promise<void> {
        const { userId } = request.params();

        const friend: User | null = await this.userRepository.findOneBy({ frontId: Number(userId) });
        if (!friend) {
            return response.notFound({ error: 'User not found' });
        }

        const friendRelationships: Friend[] = await this.friendRepository.findFromUsers(user, friend);
        if (!friendRelationships.length) {
            return response.notFound({ error: 'You are not friend with this user' });
        }

        friendRelationships.map(async (friend: Friend): Promise<void> => await friend.delete());

        transmit.broadcast(`notification/friend/remove/${friend.frontId}`, user.apiSerialize());

        return response.send({ message: 'Friend removed' });
    }
}
