import type { HttpContext } from '@adonisjs/core/http';
import type { NextFn } from '@adonisjs/core/types/http';
import { inject } from '@adonisjs/core';

@inject()
export default class IsForeignTerritoryMiddleware {
    async handle(ctx: HttpContext, next: NextFn): Promise<any> {
        if (ctx.game.season !== ctx.game.map.mainSeason) {
            return ctx.response.forbidden({ error: "You can't perform this on this season" });
        }

        return next();
    }
}
