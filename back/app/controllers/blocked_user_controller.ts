import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import BlockedUserRepository from '#repositories/blocked_user_repository';
import transmit from '@adonisjs/transmit/services/main';

@inject()
export default class BlockedController {
    constructor(private readonly blockedUserRepository: BlockedUserRepository) {}

    public async search({ request, response, user }: HttpContext): Promise<void> {
        transmit.broadcast('test', { message: 'Hello' });
        return response.send({
            blockedUsers: await this.blockedUserRepository.search(request.qs().query ?? '', request.qs().page ?? 1, request.qs().perPage ?? 24, user),
        });
    }
}
