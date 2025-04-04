import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import UserRepository from '#repositories/user_repository';
import { getUsersValidator } from '#validators/user';

@inject()
export default class UserController {
    constructor(private readonly userRepository: UserRepository) {}

    public async searchNotFriends({ request, response, user }: HttpContext): Promise<void> {
        const { query, page, perPage } = await getUsersValidator.validate(request.all());
        return response.send({
            users: await this.userRepository.searchNotFriends(query ?? '', page ?? 1, perPage ?? 10, user),
        });
    }
}
