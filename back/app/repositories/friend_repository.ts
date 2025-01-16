import BaseRepository from '#repositories/base/base_repository';
import Friend from '#models/friend';

export default class FriendRepository extends BaseRepository<typeof Friend> {
    constructor() {
        super(Friend);
    }
}
