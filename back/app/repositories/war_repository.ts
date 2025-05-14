import BaseRepository from '#repositories/base/base_repository';
import RoomPlayer from '#models/room_player';
import War from '#models/war';
import WarStatusEnum from '#types/enum/war_status_enum';
import Game from '#models/game';

export default class RoomPlayerWarRepository extends BaseRepository<typeof War> {
    constructor() {
        super(War);
    }

    public async endWar(player: RoomPlayer, otherPlayer: RoomPlayer, game: Game): Promise<void> {
        await this.Model.query()
            .where('player_id', player.id)
            .where('enemy_id', otherPlayer.id)
            .orWhere('player_id', otherPlayer.id)
            .where('enemy_id', player.id)
            .update('status', WarStatusEnum.FINISHED)
            .update('end_season', game.season)
            .update('end_year', game.year);
    }
}
