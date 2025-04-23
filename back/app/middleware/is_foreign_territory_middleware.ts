import type { HttpContext } from '@adonisjs/core/http';
import type { NextFn } from '@adonisjs/core/types/http';
import { isForeignTerritoryValidator } from '#validators/game';
import GameTerritory from '#models/game_territory';
import { inject } from '@adonisjs/core';
import GameTerritoryRepository from '#repositories/game_territory_repository';

@inject()
export default class IsForeignTerritoryMiddleware {
    constructor(private readonly gameTerritoryRepository: GameTerritoryRepository) {}

    async handle(ctx: HttpContext, next: NextFn): Promise<any> {
        const { territoryId } = await isForeignTerritoryValidator.validate(ctx.request.params());

        const territory: GameTerritory = await this.gameTerritoryRepository.findOneFromTerritoryId(territoryId, ctx.game);
        if (territory.ownerId === ctx.player.id) {
            return ctx.response.forbidden({ error: "You can't perform this on your own territory" });
        }

        ctx.gameTerritory = territory;

        return next();
    }
}
