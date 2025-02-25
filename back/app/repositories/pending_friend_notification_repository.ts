import BaseRepository from '#repositories/base/base_repository';
import User from '#models/user';
import { ModelPaginatorContract } from '@adonisjs/lucid/types/model';
import PaginatedNotifications from '#types/paginated/paginated_pending_friend_notifications';
import SerializedPendingFriendNotification from '#types/serialized/serialized_pending_friend_notification';
import PendingFriendNotification from '#models/pending_friend_notification';

export default class PendingFriendNotificationRepository extends BaseRepository<typeof PendingFriendNotification> {
    constructor() {
        super(PendingFriendNotification);
    }

    public async getCount(user: User): Promise<number> {
        const countResult: PendingFriendNotification[] = await this.Model.query().where('for_id', user.id).count('* as total');
        return countResult[0].$extras.total;
    }

    public async getPagination(page: number, perPage: number, user: User, seen: boolean | undefined = undefined): Promise<PaginatedNotifications> {
        const notifications: ModelPaginatorContract<PendingFriendNotification> = await this.Model.query()
            .if(seen !== undefined, (queryBuilder): void => {
                queryBuilder.where('seen', <boolean>seen);
            })
            .where('for_id', user.id)
            .orderBy('created_at', 'desc')
            .preload('from', (fromQuery): void => {
                fromQuery.preload('profilePicture');
            })
            .paginate(page, perPage);

        return {
            notifications: await Promise.all(
                notifications.all().map((notification: PendingFriendNotification): SerializedPendingFriendNotification => {
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
