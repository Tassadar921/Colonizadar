import BaseRepository from '#repositories/base/base_repository';
import Bot from '#models/bot';

export default class BotRepository extends BaseRepository<typeof Bot> {
    constructor() {
        super(Bot);
    }
}
