import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import BlockedUserRepository from '#repositories/blocked_user_repository';
import {getBlockedUsersValidator} from "#validators/blocked";

@inject()
export default class BlockedController {
    constructor(private readonly blockedUserRepository: BlockedUserRepository) {}

    public async search({ request, response, user }: HttpContext): Promise<void> {
        const { query, page, perPage } = await getBlockedUsersValidator.validate(request.all());
        return response.send({
            blockedUsers: await this.blockedUserRepository.search(query ?? '', page ?? 1, perPage ?? 10, user),
        });
    }
}
