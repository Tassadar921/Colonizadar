import BaseRepository from '#repositories/base/base_repository';
import RoomPerson from '#models/room_person';

export default class RoomPersonRepository extends BaseRepository<typeof RoomPerson> {
    constructor() {
        super(RoomPerson);
    }
}
