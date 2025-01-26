import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import { createRoomValidator, joinRoomValidator } from '#validators/room';
import Room from '#models/room';
import RoomRepository from '#repositories/room_repository';
import RoomStatusEnum from '#types/enum/room_status_enum';
import RoomPlayer from "#models/room_player";

@inject()
export default class RoomController {
    constructor(private readonly roomRepository: RoomRepository) {}

    public async create({ request, response, user }: HttpContext): Promise<void> {
        const activeRoom: Room | null = await this.roomRepository.findOneBy({
            ownerId: user.id,
            status: RoomStatusEnum.ACTIVE,
        });
        if (activeRoom) {
            return response.send({ room: activeRoom.apiSerialize() });
        }

        const { name, password } = await createRoomValidator.validate(request.all());

        const room: Room = await Room.create({
            name,
            public: !password,
            password: password ?? null,
            ownerId: user.id,
        });
        await room.refresh();

        await RoomPlayer.create({
            userId: user.id,
            isUserConnected: true,
            roomId: room.id,
        });

        await room.load('players');

        return response.send({ room: room.apiSerialize() });
    }

    public async join({ request, response, user }: HttpContext): Promise<void> {
        const { token } = await joinRoomValidator.validate(request.all());
    }
}
