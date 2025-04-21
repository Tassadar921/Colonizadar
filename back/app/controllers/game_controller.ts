import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';

@inject()
export default class GameController {
    constructor() {}

    public async get({ response, user, language, game }: HttpContext): Promise<void> {
        return response.send({ game: game.apiSerialize(language, user) });
    }
}
