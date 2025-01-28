import { inject } from '@adonisjs/core';
import { HttpContext } from '@adonisjs/core/http';
import { createRoomValidator, getRoomValidator, inviteRoomValidator, joinRoomValidator } from '#validators/room';
import Room from '#models/room';
import RoomRepository from '#repositories/room_repository';
import RoomStatusEnum from '#types/enum/room_status_enum';
import RoomPlayer from '#models/room_player';
import User from '#models/user';
import FriendRepository from '#repositories/friend_repository';
import UserRepository from '#repositories/user_repository';
import transmit from '@adonisjs/transmit/services/main';
import Friend from '#models/friend';

@inject()
export default class RoomController {
    constructor(
        private readonly roomRepository: RoomRepository,
        private readonly userRepository: UserRepository,
        private readonly friendRepository: FriendRepository
    ) {}

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

    public async invite({ request, response, user }: HttpContext): Promise<void> {
        const { userId, roomId } = await inviteRoomValidator.validate(request.all());
        const friend: User | null = await this.userRepository.findOneBy({ frontId: Number(userId) });
        if (!friend) {
            return response.notFound({ error: 'User not found' });
        }

        const friendRelationship: Friend | null = await this.friendRepository.findOneFromUsers(user, friend);
        if (!friendRelationship) {
            return response.notFound({ error: 'You are not friend with this user' });
        }

        const room: Room | null = await this.roomRepository.findOneBy({ frontId: roomId });
        if (!room) {
            return response.notFound({ error: 'Room not found' });
        }

        transmit.broadcast(`notification/play/invite/${userId}`, { roomId, from: user.apiSerialize() });
        return response.send({ message: 'Invitation sent' });
    }

    public async join({ request, response, user }: HttpContext): Promise<void> {
        const { token, roomId } = await joinRoomValidator.validate(request.all());
        let room: Room | null = null;
        if (!token && !roomId) {
            return response.badRequest({ error: 'Either token or roomId have to be sent' });
        } else if (token) {
            room = await this.roomRepository.findOneBy({ token }, ['players']);
        } else if (roomId) {
            room = await this.roomRepository.findOneBy({ frontId: roomId }, ['players']);
        }

        if (!room) {
            return response.notFound({ error: 'Room not found' });
        }

        if (!room.players.some((player: RoomPlayer): boolean => player.userId === user.id)) {
            await RoomPlayer.create({
                userId: user.id,
                roomId: room.id,
            });
        }

        return response.send({ roomId: room.frontId });
    }

    public async joined({ request, response, user }: HttpContext): Promise<void> {
        const { roomId } = await joinRoomValidator.validate(request.all());

        let room: Room | null = await this.roomRepository.findOneBy({ frontId: roomId }, ['players']);
        if (!room) {
            return response.badRequest({ error: 'Either token or roomId have to be sent' });
        }

        if (!room.players.some((player: RoomPlayer): boolean => player.userId === user.id)) {
            await RoomPlayer.create({
                userId: user.id,
                roomId: room.id,
            });
        }

        return response.send({ roomId: room.frontId });
    }
}
