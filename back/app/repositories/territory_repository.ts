import BaseRepository from '#repositories/base/base_repository';
import Territory from '#models/territory';

export default class TerritoryRepository extends BaseRepository<typeof Territory> {
    constructor() {
        super(Territory);
    }
}
