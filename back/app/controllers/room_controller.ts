import { inject } from '@adonisjs/core';
import { HttpContext, Response } from '@adonisjs/core/http';
import {createRoomValidator, inviteRoomValidator, kickValidator} from '#validators/room';
import Room from '#models/room';
import RoomRepository from '#repositories/room_repository';
import RoomStatusEnum from '#types/enum/room_status_enum';
import RoomPlayer from '#models/room_player';
import User from '#models/user';
import FriendRepository from '#repositories/friend_repository';
import UserRepository from '#repositories/user_repository';
import transmit from '@adonisjs/transmit/services/main';
import Friend from '#models/friend';
import { DateTime } from 'luxon';
import RoomPlayerDifficultyEnum from '#types/enum/room_player_difficulty_enum';
import Bot from '#models/bot';

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
            difficulty: RoomPlayerDifficultyEnum.USER,
        });

        return response.send({ roomId: room.frontId });
    }

    public async invite({ request, response, user, room }: HttpContext): Promise<void> {
        const { userId } = await inviteRoomValidator.validate(request.all());
        const friend: User | null = await this.userRepository.findOneBy({ frontId: Number(userId) });
        if (!friend) {
            return response.notFound({ error: 'User not found' });
        }

        const friendRelationship: Friend | null = await this.friendRepository.findOneFromUsers(user, friend);
        if (!friendRelationship) {
            return response.notFound({ error: 'You are not friend with this user' });
        }

        transmit.broadcast(`notification/play/invite/${userId}`, { roomId: room.frontId, from: user.apiSerialize() });
        return response.send({ message: 'Invitation sent' });
    }

    public async joined({ response, user, room, language }: HttpContext): Promise<void> {
        if (!room.players.some((player: RoomPlayer): boolean => player.userId === user.id)) {
            if (room.players.length < 6) {
                await RoomPlayer.create({
                    userId: user.id,
                    roomId: room.id,
                    difficulty: RoomPlayerDifficultyEnum.USER,
                });
            } else {
                return response.badRequest({ error: 'Too many players' });
            }
        }

        await room.load('players', (playersQuery): void => {
            playersQuery
                .preload('user', (userQuery): void => {
                    userQuery.preload('profilePicture');
                })
                .preload('bot', (botQuery): void => {
                    botQuery.preload('picture');
                })
                .orderBy('frontId');
        });
        const player: RoomPlayer = <RoomPlayer>room.players.find((player: RoomPlayer): boolean => player.userId === user.id);
        player.isUserConnected = true;
        await player.save();

        await user.load('profilePicture');

        transmit.broadcast(`notification/play/room/${room.frontId}/joined`, { user: user.apiSerialize() });

        return response.send({ room: room.apiSerialize(language) });
    }

    public async leave({ response, user, room }: HttpContext): Promise<void> {
        await this.disconnect(user, room, response);

        return response.send({ message: 'Room left' });
    }

    public async heartbeat({ response, user, room }: HttpContext): Promise<void> {
        const player: RoomPlayer | undefined = room.players.find((player: RoomPlayer): boolean => player.userId === user.id);
        if (!player) {
            return response.notFound({ error: 'You are not into this room' });
        }

        player.lastHeartbeat = DateTime.now();
        await player.save();

        return response.send({ message: 'Heartbeat updated' });
    }

    public async addBot({ response, user, room, language }: HttpContext): Promise<void> {
        if (room.ownerId !== user.id) {
            return response.forbidden({ error: 'You are not the owner of this room' });
        }
        if (room.players.length < 6) {
            // TODO : replace random by random AND not already in room
            const bot: Bot | null = await Bot.query().orderByRaw('RANDOM()').first();
            const player: RoomPlayer = await RoomPlayer.create({
                roomId: room.id,
                difficulty: RoomPlayerDifficultyEnum.MEDIUM,
                botId: bot?.id,
            });

            await player.load('bot', (botQuery): void => {
                botQuery.preload('picture');
            });
            await player.refresh();

            // TODO: send transmit notification to room

            return response.send({ player: player.apiSerialize(language) });
        } else {
            return response.badRequest({ error: 'Too many players' });
        }
    }

    public async getDifficulties({ response }: HttpContext): Promise<void> {
        return response.send({ difficulties: Object.values(RoomPlayerDifficultyEnum) });
    }

    public async kick({ request, response, user, room }: HttpContext): Promise<void> {
        if (room.ownerId !== user.id) {
            return response.forbidden({ error: 'You are not the owner of this room' });
        }

        const { playerId } = await kickValidator.validate(request.params());

        const player: RoomPlayer | undefined = room.players.find((player: RoomPlayer): boolean => player.frontId === playerId);
        if (!player) {
            return response.notFound({ error: 'Player is not into this room' });
        }

        await player.delete();

        // TODO: send transmit notification to room
        return response.send({ message: 'Player kicked' });
    }

    private async disconnect(user: User, room: Room, response: Response): Promise<void> {
        if (room.ownerId === user.id) {
            room.status = RoomStatusEnum.CLOSED;
            await room.save();

            transmit.broadcast(`notification/play/room/${room.frontId}/closed`);
        } else {
            const player: RoomPlayer | undefined = room.players.find((player: RoomPlayer): boolean => player.userId === user.id);
            if (!player) {
                return response.notFound({ error: 'You are not into this room' });
            }

            await player.delete();

            transmit.broadcast(`notification/play/room/${room.frontId}/leave`, { user: user.apiSerialize() });
        }
    }
}
