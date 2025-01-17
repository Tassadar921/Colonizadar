import BaseRepository from '#repositories/base/base_repository';
import Notification from '#models/notification';
import User from '#models/user';
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model';
import PaginatedNotifications from '#types/paginated/paginated_notifications';
import SerializedNotification from '#types/serialized/serialized_notification';

export default class NotificationRepository extends BaseRepository<typeof Notification> {
    constructor() {
        super(Notification);
    }

    public async search(page: number, perPage: number, user: User, seen: boolean | undefined = undefined): Promise<PaginatedNotifications> {
        const notifications: ModelPaginatorContract<Notification> = await Notification.query()
            .if(seen !== undefined, (queryBuilder): void => {
                queryBuilder.where('seen', <boolean>seen);
            })
            .where('user_id', user.id)
            .orderBy('created_at', 'desc')
            .paginate(page, perPage);

        return {
            notifications: await Promise.all(
                notifications.all().map((notification: Notification): SerializedNotification => {
                    return notification.apiSerialize();
                })
            ),
            firstPage: notifications.firstPage,
            lastPage: notifications.lastPage,
            perPage,
            total: notifications.total,
            currentPage: page,
        };
    }
}
