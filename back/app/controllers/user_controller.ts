import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import UserRepository from '#repositories/user_repository';

@inject()
export default class BlockedController {
    constructor(private readonly userRepository: UserRepository) {}

    public async search({ request, response, user }: HttpContext): Promise<void> {
        return response.send({
            blockedUsers: await this.userRepository.search(request.qs().query ?? '', request.qs().page ?? 1, request.qs().perPage ?? 24, user),
        });
    }
}
