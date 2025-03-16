import { HttpContext } from '@adonisjs/core/http';
import { inject } from '@adonisjs/core';
import GameRepository from '#repositories/game_repository';
import { gameMiddlewareValidator } from '#validators/game';
import Game from '#models/game';

@inject()
export default class GameMiddleware {
    constructor(private readonly gameRepository: GameRepository) {}

    public async handle(ctx: HttpContext, next: () => Promise<void>): Promise<void> {
        const { gameId } = await gameMiddlewareValidator.validate(ctx.request.params());

        if (!gameId) {
            return ctx.response.badRequest({ error: 'Game id is required' });
        }

        const game: Game | null = await this.gameRepository.getFromFrontId(gameId);
        if (!game) {
            console.log('not found');
            return ctx.response.notFound({ error: 'Game not found' });
        }

        ctx.game = game;
        await next();
    }
}
