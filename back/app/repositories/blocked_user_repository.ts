import BaseRepository from '#repositories/base/base_repository';
import BlockedUser from '#models/blocked_user';

export default class BlockedUserRepository extends BaseRepository<typeof BlockedUser> {
    constructor() {
        super(BlockedUser);
    }
}
