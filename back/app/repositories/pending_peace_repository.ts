import BaseRepository from '#repositories/base/base_repository';
import PendingPeace from '#models/pending_peace';
import RoomPlayer from '#models/room_player';

export default class PendingPeaceRepository extends BaseRepository<typeof PendingPeace> {
    constructor() {
        super(PendingPeace);
    }

    public async removeByPlayers(player: RoomPlayer, otherPlayer: RoomPlayer): Promise<void> {
        await this.Model.query().where('player_id', player.id).where('enemy_id', otherPlayer.id).orWhere('player_id', otherPlayer.id).where('enemy_id', player.id).delete();
    }
}
