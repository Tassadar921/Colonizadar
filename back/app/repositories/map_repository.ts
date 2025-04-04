import BaseRepository from '#repositories/base/base_repository';
import Map from '#models/map';

export default class MapRepository extends BaseRepository<typeof Map> {
    constructor() {
        super(Map);
    }
}
