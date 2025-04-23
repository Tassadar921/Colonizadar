import type { HttpContext } from '@adonisjs/core/http';
import type { NextFn } from '@adonisjs/core/types/http';
import RoomPlayer from '#models/room_player';

export default class IsGamePlayerMiddleware {
    async handle(ctx: HttpContext, next: NextFn): Promise<any> {
        const player: RoomPlayer | undefined = ctx.game.room.players.find((player: RoomPlayer): boolean => player.userId === ctx.user.id);
        if (!player) {
            return ctx.response.notFound({ error: 'You are not into this room' });
        }

        ctx.player = player;
        return next();
    }
}
