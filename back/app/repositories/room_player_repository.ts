import BaseRepository from '#repositories/base/base_repository';
import RoomPlayer from '#models/room_player';
import Room from '#models/room';
import Bot from '#models/bot';
import PlayableCountry from '#models/playable_country';
import BotDifficulty from '#models/bot_difficulty';
import BotRepository from '#repositories/bot_repository';
import PlayableCountryRepository from '#repositories/playable_country_repository';
import BotDifficultyRepository from '#repositories/bot_difficulty_repository';
import { inject } from '@adonisjs/core';

@inject()
export default class RoomPlayerRepository extends BaseRepository<typeof RoomPlayer> {
    constructor(
        private readonly botRepository: BotRepository,
        private readonly playableCountryRepository: PlayableCountryRepository,
        private readonly botDifficultyRepository: BotDifficultyRepository
    ) {
        super(RoomPlayer);
    }

    public async createBot(room: Room): Promise<RoomPlayer> {
        const bot: Bot = await this.botRepository.getOneForRoom(room);
        const country: PlayableCountry = await this.playableCountryRepository.firstOrFail();
        const difficulty: BotDifficulty = await this.botDifficultyRepository.firstOrFail({ isDefault: true });

        const player: RoomPlayer = await RoomPlayer.create({
            roomId: room.id,
            difficultyId: difficulty.id,
            botId: bot?.id,
            countryId: country.id,
        });

        await player.refresh();

        await player.load('bot');
        await player.load('country');
        await player.load('difficulty');

        return player;
    }
}
