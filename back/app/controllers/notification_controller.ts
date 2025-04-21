import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import { getPendingFriendNotificationsValidator } from '#validators/notification';
import PendingFriendNotificationRepository from '#repositories/pending_friend_notification_repository';
import cache from '@adonisjs/cache/services/main';
import PaginatedPendingFriendNotifications from '#types/paginated/paginated_pending_friend_notifications';

@inject()
export default class NotificationController {
    constructor(private readonly pendingFriendNotificationRepository: PendingFriendNotificationRepository) {}

    public async getTotalCount({ response, user }: HttpContext): Promise<void> {
        return response.send({
            count: await cache.getOrSet({
                key: `notifications-count:${user.id}`,
                ttl: '5m',
                factory: async (): Promise<number> => {
                    return await this.pendingFriendNotificationRepository.getCount(user);
                },
            }),
        });
    }

    public async getPendingFriends({ request, response, user }: HttpContext): Promise<void> {
        const { page, perPage, seen } = await getPendingFriendNotificationsValidator.validate(request.all());

        return response.send({
            notifications: await cache.getOrSet({
                key: `notifications:${user.id}`,
                ttl: '5m',
                factory: async (): Promise<PaginatedPendingFriendNotifications> => {
                    return await this.pendingFriendNotificationRepository.getPagination(page ?? 1, perPage ?? 30, user, seen);
                },
            }),
        });
    }
}
