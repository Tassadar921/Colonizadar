import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import { joinRoomValidator } from '#validators/room';
import Room from "#models/room";

@inject()
export default class RoomController {
    public async create({ response, user }: HttpContext): Promise<void> {
        const room: Room = await Room.create({

        });
    }

    public async join({ request, response, user }: HttpContext): Promise<void> {
        const { token } = await joinRoomValidator.validate(request.all());
    }
}
