import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import UserRepository from '#repositories/user_repository';
import { getUsersValidator } from '#validators/user';
import cache from '@adonisjs/cache/services/main';
import PaginatedUsers from '#types/paginated/paginated_users';

@inject()
export default class UserController {
    constructor(private readonly userRepository: UserRepository) {}

    public async searchNotFriends({ request, response, user }: HttpContext): Promise<void> {
        const { query, page, perPage } = await getUsersValidator.validate(request.all());
        return response.send({
            users: await cache.getOrSet({
                key: `user-not-friends:${user.id}`,
                ttl: '5m',
                factory: async (): Promise<PaginatedUsers> => {
                    return await this.userRepository.searchNotFriends(query ?? '', page ?? 1, perPage ?? 10, user);
                },
            }),
        });
    }
}
