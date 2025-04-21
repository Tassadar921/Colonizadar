import BaseRepository from '#repositories/base/base_repository';
import BotDifficulty from '#models/bot_difficulty';

export default class BotDifficultyRepository extends BaseRepository<typeof BotDifficulty> {
    constructor() {
        super(BotDifficulty);
    }
}
