import type { HttpContext } from '@adonisjs/core/http';
import type { NextFn } from '@adonisjs/core/types/http';
import { gameTerritoryMiddlewareValidator } from '#validators/game';
import { inject } from '@adonisjs/core';
import GameTerritoryRepository from '#repositories/game_territory_repository';

@inject()
export default class GameTerritoryMiddleware {
    constructor(private readonly gameTerritoryRepository: GameTerritoryRepository) {}

    async handle(ctx: HttpContext, next: NextFn): Promise<any> {
        const { territoryCode } = await gameTerritoryMiddlewareValidator.validate(ctx.request.params());

        ctx.gameTerritory = await this.gameTerritoryRepository.findOneFromTerritoryId(territoryCode, ctx.game);

        return next();
    }
}
