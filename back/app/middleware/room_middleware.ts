import { HttpContext } from '@adonisjs/core/http';
import { inject } from '@adonisjs/core';
import RoomRepository from '#repositories/room_repository';
import Room from '#models/room';
import { roomMiddlewareValidator } from '#validators/room';
import type { NextFn } from '@adonisjs/core/types/http';

@inject()
export default class RoomMiddleware {
    constructor(private readonly roomRepository: RoomRepository) {}

    public async handle(ctx: HttpContext, next: NextFn): Promise<void> {
        const { roomId: paramRoomId } = await roomMiddlewareValidator.validate(ctx.request.params());
        const { token, roomId: bodyRoomId, password } = await roomMiddlewareValidator.validate(ctx.request.all());

        let room: Room | null = null;
        if (!paramRoomId && !token && !bodyRoomId) {
            return ctx.response.badRequest({ error: 'Either roomId or token are required' });
        } else if (token) {
            // Join on invite from room's token
            room = await this.roomRepository.getFromUserAndToken(token, password);
        } else if (paramRoomId || bodyRoomId) {
            // get room from roomId, on friend invite or page refresh
            room = await this.roomRepository.getFromFrontId(<number>(paramRoomId || bodyRoomId));
        }

        if (!room) {
            return ctx.response.notFound({ error: 'Room not found' });
        }

        ctx.room = room;
        await next();
    }
}
