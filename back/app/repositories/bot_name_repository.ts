import BaseRepository from '#repositories/base/base_repository';
import BotName from "#models/bot_name";

export default class BotNameRepository extends BaseRepository<typeof BotName> {
    constructor() {
        super(BotName);
    }
}
