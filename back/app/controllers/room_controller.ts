import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import { createRoomValidator, joinRoomValidator } from '#validators/room';
import Room from '#models/room';
import RoomRepository from '#repositories/room_repository';
import RoomStatusEnum from '#types/enum/room_status_enum';

@inject()
export default class RoomController {
    constructor(private readonly roomRepository: RoomRepository) {}

    public async create({ request, response, user }: HttpContext): Promise<void> {
        const activeRoom: Room | null = await this.roomRepository.findOneBy({
            ownerId: user.id,
            status: RoomStatusEnum.ACTIVE,
        });
        if (activeRoom) {
            return response.send()
        }

        const { name, password } = await createRoomValidator.validate(request.all());

        const room: Room = await Room.create({
            name,
            public: !password,
            password: password ?? null,
        });
    }

    public async join({ request, response, user }: HttpContext): Promise<void> {
        const { token } = await joinRoomValidator.validate(request.all());
    }
}
