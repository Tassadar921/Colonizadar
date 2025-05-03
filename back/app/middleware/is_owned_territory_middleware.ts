import type { HttpContext } from '@adonisjs/core/http';
import type { NextFn } from '@adonisjs/core/types/http';
import { inject } from '@adonisjs/core';

@inject()
export default class IsForeignTerritoryMiddleware {
    async handle(ctx: HttpContext, next: NextFn): Promise<any> {
        if (ctx.gameTerritory.ownerId !== ctx.player.id) {
            return ctx.response.forbidden({ error: 'You only can perform this on your own territory' });
        }

        return next();
    }
}
