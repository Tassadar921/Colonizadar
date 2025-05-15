import BaseRepository from '#repositories/base/base_repository';
import Log from '#models/log';

export default class LogRepository extends BaseRepository<typeof Log> {
    constructor() {
        super(Log);
    }
}
