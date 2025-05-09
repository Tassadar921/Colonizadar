import BaseRepository from '#repositories/base/base_repository';
import RoomPlayerWar from '#models/room_player_war';

export default class RoomPlayerWarRepository extends BaseRepository<typeof RoomPlayerWar> {
    constructor() {
        super(RoomPlayerWar);
    }
}
