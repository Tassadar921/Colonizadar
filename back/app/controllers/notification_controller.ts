import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import NotificationRepository from '#repositories/notification_repository';
import { getNotificationsValidator } from '#validators/notification';

@inject()
export default class NotificationController {
    constructor(private readonly notificationRepository: NotificationRepository) {}

    public async get({ request, response, user }: HttpContext): Promise<void> {
        const { page, perPage, seen } = await getNotificationsValidator.validate(request.all());
        return response.send({
            notifications: await this.notificationRepository.search(page ?? 1, perPage ?? 24, user, seen),
        });
    }
}
