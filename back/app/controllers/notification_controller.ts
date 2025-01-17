import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import NotificationRepository from '#repositories/notification_repository';

@inject()
export default class NotificationController {
    constructor(private readonly notificationRepository: NotificationRepository) {}

    public async get({ request, response, user }: HttpContext): Promise<void> {
        return response.send({
            notifications: await this.notificationRepository.search(request.qs().page ?? 1, request.qs().perPage ?? 24, user, request.qs().seen),
        });
    }
}
