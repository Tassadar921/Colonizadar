import { inject } from '@adonisjs/core';
import FriendRepository from '#repositories/friend_repository';
import { HttpContext } from '@adonisjs/core/http';

@inject()
export default class FriendsController {
    constructor(private readonly friendRepository: FriendRepository) {}

    public async search({ request, response, user }: HttpContext): Promise<void> {
        return response.send({
            friends: await this.friendRepository.search(request.qs().query ?? '', request.qs().page ?? 1, request.qs().perPage ?? 24, user),
        });
    }
}
