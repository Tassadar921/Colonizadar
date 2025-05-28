import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import BlockedUserRepository from '#repositories/blocked_user_repository';
import { blockValidator, cancelValidator, getBlockedUsersValidator } from '#validators/blocked';
import User from '#models/user';
import PendingFriend from '#models/pending_friend';
import UserRepository from '#repositories/user_repository';
import PendingFriendRepository from '#repositories/pending_friend_repository';
import Friend from '#models/friend';
import FriendRepository from '#repositories/friend_repository';
import BlockedUser from '#models/blocked_user';
import transmit from '@adonisjs/transmit/services/main';
import cache from '@adonisjs/cache/services/main';
import PaginatedBlockedUsers from '#types/paginated/paginated_blocked_users';

@inject()
export default class BlockedUserController {
    constructor(
        private readonly blockedUserRepository: BlockedUserRepository,
        private readonly userRepository: UserRepository,
        private readonly pendingFriendRepository: PendingFriendRepository,
        private readonly friendRepository: FriendRepository
    ) {}

    public async search({ request, response, user }: HttpContext): Promise<void> {
        const { query, page, perPage } = await request.validateUsing(getBlockedUsersValidator);

        return response.send({
            blockedUsers: await cache.getOrSet({
                key: `user-blocked:${user.id}`,
                ttl: '5m',
                factory: async (): Promise<PaginatedBlockedUsers> => {
                    return await this.blockedUserRepository.search(query ?? '', page ?? 1, perPage ?? 10, user);
                },
            }),
        });
    }

    public async block({ request, response, user, i18n }: HttpContext): Promise<void> {
        const { userId } = await blockValidator.validate(request.params());

        const blockingUser: User = await this.userRepository.firstOrFail({ frontId: userId });

        const blockedUsers: BlockedUser[] = await this.blockedUserRepository.findFromUsers(user, blockingUser);
        if (blockedUsers.length) {
            return response.status(409).send({ error: i18n.t('messages.blocked-user.block.error', { username: blockingUser.username }) });
        }

        const pendingFriends: PendingFriend[] = await this.pendingFriendRepository.findFromUsers(user, blockingUser);
        pendingFriends.map(async (pendingFriend: PendingFriend): Promise<void> => {
            transmit.broadcast(`notification/add-friend/cancel/${userId}`, pendingFriend.apiSerialize());
            await pendingFriend.delete();
        });

        const friendRelationships: Friend[] = await this.friendRepository.findFromUsers(user, blockingUser);
        friendRelationships.map(async (friend: Friend): Promise<void> => {
            await friend.delete();
        });

        await BlockedUser.create({
            blockerId: user.id,
            blockedId: blockingUser.id,
        });
        transmit.broadcast(`notification/blocked/${userId}`, user.apiSerialize());

        return response.send({ message: i18n.t('messages.blocked-user.block.success', { username: blockingUser.username }) });
    }

    public async cancel({ request, response, user, i18n }: HttpContext): Promise<void> {
        const { userId } = await cancelValidator.validate(request.params());

        const blockingUser: User | null = await this.userRepository.firstOrFail({ frontId: userId });

        const blockedUsers: BlockedUser[] = await this.blockedUserRepository.findFromUsers(user, blockingUser);
        if (!blockedUsers.length) {
            return response.notFound({ error: i18n.t('messages.blocked-user.cancel.error', { username: blockingUser.username }) });
        }

        blockedUsers.map(async (blockedUser: BlockedUser): Promise<void> => {
            await blockedUser.delete();
        });

        transmit.broadcast(`notification/unblocked/${userId}`);

        return response.send({ message: i18n.t('messages.blocked-user.cancel.success', { username: blockingUser.username }) });
    }
}
