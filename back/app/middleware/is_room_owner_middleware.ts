import type { HttpContext } from '@adonisjs/core/http';
import type { NextFn } from '@adonisjs/core/types/http';

export default class IsRoomOwnerMiddleware {
    async handle(ctx: HttpContext, next: NextFn): Promise<any> {
        if (ctx.room.ownerId !== ctx.user.id) {
            return ctx.response.forbidden({ error: 'You are not the owner of this room' });
        }

        return next();
    }
}
