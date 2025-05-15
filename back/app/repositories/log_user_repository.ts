import BaseRepository from '#repositories/base/base_repository';
import LogUser from '#models/log_user';

export default class LogUserRepository extends BaseRepository<typeof LogUser> {
    constructor() {
        super(LogUser);
    }
}
