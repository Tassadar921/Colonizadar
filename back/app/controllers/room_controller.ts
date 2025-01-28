import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import { createRoomValidator, getRoomValidator, joinRoomValidator } from '#validators/room';
import Room from '#models/room';
import RoomRepository from '#repositories/room_repository';
import RoomStatusEnum from '#types/enum/room_status_enum';
import RoomPlayer from '#models/room_player';

@inject()
export default class RoomController {
    constructor(private readonly roomRepository: RoomRepository) {}

    public async create({ request, response, user }: HttpContext): Promise<void> {
        const activeRoom: Room | null = await this.roomRepository.findOneBy({
            ownerId: user.id,
            status: RoomStatusEnum.ACTIVE,
        });
        if (activeRoom) {
            activeRoom.status = RoomStatusEnum.CLOSED;
            await activeRoom.save();
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

        return response.send({ roomId: room.frontId });
    }

    public async get({ request, response, user }: HttpContext): Promise<void> {
        const { roomId } = await getRoomValidator.validate(request.params());

        const room: Room | null = await this.roomRepository.getFromUserAndFrontId(user, roomId);
        if (!room) {
            return response.badRequest({ error: 'Room not found' });
        }
        return response.send({ room: room.apiSerialize() });
    }

    public async join({ request, response, user }: HttpContext): Promise<void> {
        const { token } = await joinRoomValidator.validate(request.all());
    }
}
