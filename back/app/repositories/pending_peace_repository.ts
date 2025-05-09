import BaseRepository from '#repositories/base/base_repository';
import PendingPeace from '#models/pending_peace';

export default class PendingPeaceRepository extends BaseRepository<typeof PendingPeace> {
    constructor() {
        super(PendingPeace);
    }
}
