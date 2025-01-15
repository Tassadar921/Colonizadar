import BaseRepository from '#repositories/base/base_repository'
import User from '#models/user'

export default class UserRepository extends BaseRepository<typeof User> {
    constructor() {
        super(User)
    }
}
