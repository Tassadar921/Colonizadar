import { HttpContext } from '@adonisjs/core/http';
import { inject } from '@adonisjs/core';
import GameRepository from '#repositories/game_repository';
import { gameMiddlewareValidator } from '#validators/game';
import type { NextFn } from '@adonisjs/core/types/http';

@inject()
export default class GameMiddleware {
    constructor(private readonly gameRepository: GameRepository) {}

    public async handle(ctx: HttpContext, next: NextFn): Promise<void> {
        const { gameId } = await gameMiddlewareValidator.validate(ctx.request.params());

        try {
            if (!gameId) {
                throw new Error();
            }

            ctx.game = await this.gameRepository.getFromFrontId(gameId);
            await next();
        } catch (error: any) {
            return ctx.response.badRequest({ error: 'Game id is required' });
        }
    }
}
