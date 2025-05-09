import BaseRepository from '#repositories/base/base_repository';
import Peace from '#models/peace';

export default class PeaceRepository extends BaseRepository<typeof Peace> {
    constructor() {
        super(Peace);
    }
}
