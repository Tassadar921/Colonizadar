import BaseRepository from '#repositories/base/base_repository';
import RoomPlayer from "#models/room_player";

export default class RoomPlayerRepository extends BaseRepository<typeof RoomPlayer> {
    constructor() {
        super(RoomPlayer);
    }
}
