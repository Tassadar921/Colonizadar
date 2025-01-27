import BaseRepository from '#repositories/base/base_repository';
import Room from '#models/room';

export default class RoomRepository extends BaseRepository<typeof Room> {
    constructor() {
        super(Room);
    }
}
