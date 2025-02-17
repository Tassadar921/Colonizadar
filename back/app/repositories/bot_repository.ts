import BaseRepository from '#repositories/base/base_repository';
import Bot from '#models/bot';
import Room from '#models/room';
import RoomPlayer from '#models/room_player';

export default class BotRepository extends BaseRepository<typeof Bot> {
    constructor() {
        super(Bot);
    }

    public async getOneForRoom(room: Room): Promise<Bot> {
        let bot: Bot | null = null;
        while (!bot) {
            bot = await Bot.query()
                .whereNotIn(
                    'id',
                    room.players.map((player: RoomPlayer): string => player.botId).filter((botId: string): string => botId)
                )
                .orderByRaw('RANDOM()')
                .first();
        }
        return bot;
    }
}
