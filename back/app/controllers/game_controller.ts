import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';

@inject()
export default class MapController {
    constructor() {}

    public async get({ response, language, game }: HttpContext): Promise<void> {
        return response.send({ game: game.apiSerialize(language) });
    }
}
