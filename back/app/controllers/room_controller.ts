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
import BotRepository from '#repositories/bot_repository';
import Language from '#models/language';
import PlayableCountryRepository from '#repositories/playable_country_repository';
import PlayableCountry from '#models/playable_country';
import { selectCountryParamValidator, selectCountryValidator } from '#validators/room_player';

@inject()
export default class RoomController {
    constructor(
        private readonly roomRepository: RoomRepository,
        private readonly userRepository: UserRepository,
        private readonly friendRepository: FriendRepository,
        private readonly botRepository: BotRepository,
        private readonly playableCountryRepository: PlayableCountryRepository
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

        const country: PlayableCountry = await this.playableCountryRepository.getFirst();
        await RoomPlayer.create({
            userId: user.id,
            isUserConnected: true,
            roomId: room.id,
            difficulty: RoomPlayerDifficultyEnum.USER,
            countryId: country.id,
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

    public async join({ response, user, room }: HttpContext): Promise<void> {
        if (!room.players.some((player: RoomPlayer): boolean => player.userId === user.id)) {
            if (room.players.length < 6) {
                return response.send({ message: 'Room joined', roomId: room.frontId });
            }

            return response.badRequest({ error: 'Too many players' });
        }

        // if user is already in room
        return response.send({ message: 'Room joined', roomId: room.frontId });
    }

    public async joined({ response, user, room, language }: HttpContext): Promise<void> {
        if (!room.players.some((player: RoomPlayer): boolean => player.userId === user.id)) {
            if (room.players.length < 6) {
                const country: PlayableCountry = await this.playableCountryRepository.getFirst();
                await RoomPlayer.create({
                    userId: user.id,
                    roomId: room.id,
                    difficulty: RoomPlayerDifficultyEnum.USER,
                    countryId: country.id,
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
                .preload('country', (countryQuery): void => {
                    countryQuery.preload('flag');
                })
                .orderBy('frontId');
        });
        const player: RoomPlayer = <RoomPlayer>room.players.find((player: RoomPlayer): boolean => player.userId === user.id);
        player.isUserConnected = true;
        await player.save();

        await user.load('profilePicture');

        transmit.broadcast(`notification/play/room/${room.frontId}/player/joined`, { player: player.apiSerialize(language) });

        return response.send({ room: room.apiSerialize(language) });
    }

    public async leave({ response, user, room, language }: HttpContext): Promise<void> {
        console.log('disconnect');
        await this.disconnect(user, room, language, response);

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
            let bot: Bot = await this.botRepository.getOneForRoom(room);
            const country: PlayableCountry = await this.playableCountryRepository.getFirst();
            const player: RoomPlayer = await RoomPlayer.create({
                roomId: room.id,
                difficulty: RoomPlayerDifficultyEnum.MEDIUM,
                botId: bot?.id,
                countryId: country.id,
            });

            await player.load('bot', (botQuery): void => {
                botQuery.preload('picture');
            });
            await player.load('country', (countryQuery): void => {
                countryQuery.preload('flag');
            });
            await player.refresh();

            transmit.broadcast(`notification/play/room/${room.frontId}/player/joined`, { player: player.apiSerialize(language) });

            return response.send({ player: player.apiSerialize(language) });
        } else {
            return response.badRequest({ error: 'Too many players' });
        }
    }

    public async getDifficulties({ response }: HttpContext): Promise<void> {
        return response.send({ difficulties: Object.values(RoomPlayerDifficultyEnum) });
    }

    public async kick({ request, response, user, room, language }: HttpContext): Promise<void> {
        if (room.ownerId !== user.id) {
            return response.forbidden({ error: 'You are not the owner of this room' });
        }

        const { playerId } = await kickValidator.validate(request.params());

        const player: RoomPlayer | undefined = room.players.find((player: RoomPlayer): boolean => player.frontId === playerId);
        if (!player) {
            return response.notFound({ error: 'Player is not into this room' });
        }

        await player.delete();

        transmit.broadcast(`notification/play/room/${room.frontId}/player/leave`, { player: player.apiSerialize(language) });

        return response.send({ message: 'Player kicked' });
    }

    public async selectCountry({ request, response, user, room, language }: HttpContext): Promise<void> {
        const { playerId } = await selectCountryParamValidator.validate(request.params());

        const player: RoomPlayer | undefined = room.players.find((player: RoomPlayer): boolean => player.frontId === playerId);
        if (!player) {
            return response.notFound({ error: 'Player is not into this room' });
        } else if (player.userId && player.userId !== user.id) {
            return response.forbidden({ error: "You can't change the country of another player" });
        } else if (player.botId && room.ownerId !== user.id) {
            return response.forbidden({ error: "You can't change the country of a bot if you're not the owner" });
        }

        const { countryId } = await selectCountryValidator.validate(request.all());
        const country: PlayableCountry | null = await this.playableCountryRepository.findOneBy({ frontId: countryId });
        if (!country) {
            return response.notFound({ error: 'Country not found' });
        }

        player.countryId = country.id;
        await player.save();

        await player.load('country', (countryQuery): void => {
            countryQuery.preload('flag');
        });

        transmit.broadcast(`notification/play/room/${room.frontId}/player/country`, { player: player.apiSerialize(language) });

        return response.send({ message: 'Country selected' });
    }

    private async disconnect(user: User, room: Room, language: Language, response: Response): Promise<void> {
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

            transmit.broadcast(`notification/play/room/${room.frontId}/player/leave`, { player: player.apiSerialize(language) });
        }
    }
}
