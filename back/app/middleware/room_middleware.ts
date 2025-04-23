import { HttpContext } from '@adonisjs/core/http';
import { inject } from '@adonisjs/core';
import RoomRepository from '#repositories/room_repository';
import Room from '#models/room';
import { roomMiddlewareValidator } from '#validators/room';

@inject()
export default class RoomMiddleware {
    constructor(private readonly roomRepository: RoomRepository) {}

    public async handle(ctx: HttpContext, next: () => Promise<void>): Promise<void> {
        const { token, roomId, password } = await ctx.request.validateUsing(roomMiddlewareValidator);

        let room: Room | null = null;
        if (!roomId && !token) {
            return ctx.response.badRequest({ error: 'Either roomId or token are required' });
        } else if (token) {
            // Join on invite from room's token
            room = await this.roomRepository.getFromUserAndToken(token, password);
        } else if (roomId) {
            // get room from roomId, on friend invite or page refresh
            room = await this.roomRepository.getFromFrontId(<number>roomId);
        }

        if (!room) {
            return ctx.response.notFound({ error: 'Room not found' });
        }

        ctx.room = room;
        await next();
    }
}
