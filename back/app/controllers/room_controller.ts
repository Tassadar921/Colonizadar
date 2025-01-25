import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import { joinRoomValidator } from '#validators/room';

@inject()
export default class RoomController {
    public async join({ request, response, user }: HttpContext): Promise<void> {
        const { token } = await joinRoomValidator.validate(request.all());
    }
}
