import { inject } from '@adonisjs/core';
import { HttpContext, Response } from '@adonisjs/core/http';
import { createRoomValidator, inviteRoomValidator, kickValidator } from '#validators/room';
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
import Bot from '#models/bot';
import BotRepository from '#repositories/bot_repository';
import Language from '#models/language';
import PlayableCountryRepository from '#repositories/playable_country_repository';
import PlayableCountry from '#models/playable_country';
import { selectBotDifficultyParamValidator, selectBotDifficultyValidator, selectCountryParamValidator, selectCountryValidator, setReadyValidator } from '#validators/room_player';
import BotDifficultyRepository from '#repositories/bot_difficulty_repository';
import BotDifficulty from '#models/bot_difficulty';
import SerializedBotDifficulty from '#types/serialized/serialized_bot_difficulty';
import sleep from '../utils/sleep.js';
import GameRepository from '#repositories/game_repository';
import Map from '#models/map';
import MapRepository from '#repositories/map_repository';
import Game from '#models/game';

@inject()
export default class RoomController {
    constructor(
        private readonly roomRepository: RoomRepository,
        private readonly userRepository: UserRepository,
        private readonly friendRepository: FriendRepository,
        private readonly botRepository: BotRepository,
        private readonly playableCountryRepository: PlayableCountryRepository,
        private readonly botDifficultyRepository: BotDifficultyRepository,
        private readonly mapRepository: MapRepository,
        private readonly gameRepository: GameRepository
    ) {}

    public async create({ request, response, user }: HttpContext): Promise<void> {
        const activeRoom: Room | null = await this.roomRepository.findOneBy({
            ownerId: user.id,
            status: RoomStatusEnum.OPENED,
        });
        if (activeRoom) {
            activeRoom.status = RoomStatusEnum.CLOSED;
            await activeRoom.save();
        }

        const { name, password } = await createRoomValidator.validate(request.all());

        const map: Map = await this.mapRepository.firstOrFail();

        const room: Room = await Room.create({
            name,
            public: !password,
            password: password ?? null,
            ownerId: user.id,
            mapId: map.id,
        });
        await room.refresh();

        const country: PlayableCountry = await this.playableCountryRepository.getFirst();
        await RoomPlayer.create({
            userId: user.id,
            isUserConnected: true,
            roomId: room.id,
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

    public async checkWithToken({ response, user, room }: HttpContext): Promise<void> {
        if (!room.players.some((player: RoomPlayer): boolean => player.userId === user.id)) {
            if (room.players.length < 6) {
                return response.send({ message: 'Room joined', roomId: room.frontId });
            }

            return response.badRequest({ error: 'Too many players' });
        }

        // if user is already in room
        return response.send({ message: 'Room joined', roomId: room.frontId });
    }

    public async join({ response, user, room, language }: HttpContext): Promise<void> {
        if (!room.players.some((player: RoomPlayer): boolean => player.userId === user.id)) {
            if (room.players.length < 6) {
                const country: PlayableCountry = await this.playableCountryRepository.getFirst();
                await RoomPlayer.create({
                    userId: user.id,
                    roomId: room.id,
                    countryId: country.id,
                });
            } else {
                return response.badRequest({ error: 'Too many players' });
            }
        }

        await room.load('players', (playersQuery): void => {
            playersQuery.preload('user').preload('bot').preload('country').preload('difficulty').orderBy('frontId');
        });
        const player: RoomPlayer = <RoomPlayer>room.players.find((player: RoomPlayer): boolean => player.userId === user.id);
        player.isUserConnected = true;
        await player.save();

        transmit.broadcast(`notification/play/room/${room.frontId}/player/joined`, { player: player.apiSerialize(language) });

        return response.send({ room: await room.apiSerialize(language) });
    }

    public async leave({ response, user, room, language }: HttpContext): Promise<void> {
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
            const difficulty: BotDifficulty = await this.botDifficultyRepository.getDefaultDifficulty();
            const player: RoomPlayer = await RoomPlayer.create({
                roomId: room.id,
                difficultyId: difficulty.id,
                botId: bot?.id,
                countryId: country.id,
            });

            await player.load('bot');
            await player.load('country');
            await player.load('difficulty');
            await player.refresh();

            transmit.broadcast(`notification/play/room/${room.frontId}/player/joined`, { player: player.apiSerialize(language) });

            return response.send({ player: player.apiSerialize(language) });
        } else {
            return response.badRequest({ error: 'Too many players' });
        }
    }

    public async getBotDifficulties({ response, language }: HttpContext): Promise<void> {
        const difficulties: BotDifficulty[] = await this.botDifficultyRepository.all();
        return response.send({ difficulties: difficulties.map((difficulty: BotDifficulty): SerializedBotDifficulty => difficulty.apiSerialize(language)) });
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

        await player.load('country');

        await this.setRoomNotReady(room);

        transmit.broadcast(`notification/play/room/${room.frontId}/player/update`, { player: player.apiSerialize(language) });

        return response.send({ message: 'Country selected' });
    }

    public async selectBotDifficulty({ request, response, user, room, language }: HttpContext): Promise<void> {
        const { playerId } = await selectBotDifficultyParamValidator.validate(request.params());

        const player: RoomPlayer | undefined = room.players.find((player: RoomPlayer): boolean => player.frontId === playerId);
        if (!player) {
            return response.notFound({ error: 'Player is not into this room' });
        } else if (room.ownerId !== user.id) {
            return response.forbidden({ error: 'You are not the owner of this room' });
        } else if (player.userId) {
            return response.forbidden({ error: 'Players have no difficulty' });
        } else if (player.botId && room.ownerId !== user.id) {
            return response.forbidden({ error: "You can't change the country of a bot if you're not the owner" });
        }

        const { difficultyId } = await selectBotDifficultyValidator.validate(request.all());
        const difficulty: BotDifficulty | null = await this.botDifficultyRepository.findOneBy({ frontId: difficultyId });
        if (!difficulty) {
            return response.notFound({ error: 'Difficulty not found' });
        }

        player.difficultyId = difficulty.id;
        await player.save();

        await player.load('difficulty');

        await this.setRoomNotReady(room);

        transmit.broadcast(`notification/play/room/${room.frontId}/player/update`, { player: player.apiSerialize(language) });

        return response.send({ message: 'Difficulty selected' });
    }

    public async ready({ request, response, user, room, language }: HttpContext): Promise<void> {
        const player: RoomPlayer | undefined = room.players.find((player: RoomPlayer): boolean => player.userId === user.id);
        if (!player) {
            return response.notFound({ error: 'You are not the owner of this room' });
        }

        const { isReady } = await setReadyValidator.validate(request.all());

        if (isReady) {
            const isValidReady: boolean = room.players.every((loopPlayer: RoomPlayer): boolean => {
                if (loopPlayer.userId) {
                    if (loopPlayer.id === player.id) {
                        return true;
                    }
                    return loopPlayer.countryId !== player.countryId;
                }

                const botPlayers: RoomPlayer[] = room.players.filter((p: RoomPlayer): boolean => !p.userId);

                const isUniqueAmongPlayers: boolean = !room.players.some((p: RoomPlayer): boolean => !!p.userId && p.countryId === loopPlayer.countryId);

                const uniqueBotCountries = new Set(botPlayers.map((bot: RoomPlayer): string => bot.countryId));
                const areBotsUnique: boolean = uniqueBotCountries.size === botPlayers.length;

                return isUniqueAmongPlayers && areBotsUnique;
            });

            if (!isValidReady) {
                return response.forbidden({ error: 'Every player must have a different country' });
            }
        }

        if (room.status === RoomStatusEnum.STARTING) {
            room.status = RoomStatusEnum.OPENED;
            await room.save();
        }

        player.isReady = isReady;
        await player.save();

        transmit.broadcast(`notification/play/room/${room.frontId}/player/update`, { player: player.apiSerialize(language) });
        response.send({ message: `Set to ${isReady ? 'ready' : 'not ready'}` });

        if (room.players.length === 6) {
            if (room.players.every((player: RoomPlayer): boolean => (player.botId ? true : player.isReady))) {
                this.startCountdown(room);
            }
        }
    }

    private async startCountdown(room: Room): Promise<void> {
        room.status = RoomStatusEnum.STARTING;
        await room.save();
        for (let countdown = 5; countdown > 0; countdown--) {
            const updatedRoom: Room = await Room.findOrFail(room.id);

            if (updatedRoom.status !== RoomStatusEnum.STARTING) {
                return;
            }

            transmit.broadcast(`notification/play/room/${room.frontId}/starting`, { countdown });

            await sleep(1000);
        }

        room.status = RoomStatusEnum.PLAYING;
        await room.save();

        const game: Game = await this.gameRepository.create(room);

        transmit.broadcast(`notification/play/room/${room.frontId}/game/start`, { message: 'Game is starting', gameId: game.frontId });
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

    private async setRoomNotReady(room: Room): Promise<void> {
        if (room.status === RoomStatusEnum.STARTING) {
            room.status = RoomStatusEnum.OPENED;
            await room.save();
        }
        await Promise.all(
            room.players.map(async (player: RoomPlayer): Promise<void> => {
                player.isReady = false;
                await player.save();
            })
        );
    }
}
