import { inject } from '@adonisjs/core';
import FriendRepository from '#repositories/friend_repository';
import { HttpContext } from '@adonisjs/core/http';
import { getFriendsValidator } from '#validators/friend';

@inject()
export default class FriendsController {
    constructor(private readonly friendRepository: FriendRepository) {}

    public async search({ request, response, user }: HttpContext): Promise<void> {
        const { query, page, perPage } = await getFriendsValidator.validate(request.all());
        return response.send({
            friends: await this.friendRepository.search(query ?? '', page ?? 1, perPage ?? 10, user),
        });
    }
}
