import type { HttpContext } from '@adonisjs/core/http';
import type { NextFn } from '@adonisjs/core/types/http';
import RoomStatusEnum from '#types/enum/room_status_enum';

export default class IsGamePlayingMiddleware {
    async handle(ctx: HttpContext, next: NextFn): Promise<any> {
        if (!(ctx.game.room.status === RoomStatusEnum.PLAYING)) {
            return ctx.response.badRequest({ error: 'Game is not ready for this' });
        }

        return next();
    }
}
