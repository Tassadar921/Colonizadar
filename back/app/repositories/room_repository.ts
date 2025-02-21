import BaseRepository from '#repositories/base/base_repository';
import Room from '#models/room';
import User from '#models/user';
import RoomStatusEnum from '#types/enum/room_status_enum';

export default class RoomRepository extends BaseRepository<typeof Room> {
    constructor() {
        super(Room);
    }

    public async getFromFrontId(roomId: number): Promise<Room | null> {
        return this.Model.query()
            .where('status', RoomStatusEnum.ACTIVE)
            .andWhere('front_id', roomId)
            .preload('owner')
            .preload('players', (playersQuery): void => {
                playersQuery
                    .preload('user', (userQuery): void => {
                        userQuery.preload('profilePicture');
                    })
                    .preload('bot', (botQuery): void => {
                        botQuery.preload('picture');
                    })
                    .preload('country')
                    .orderBy('frontId');
            })
            .first();
    }

    public async getFromUserAndToken(user: User, token: string): Promise<Room | null> {
        return this.Model.query()
            .select('rooms.*')
            .leftJoin('room_players', 'rooms.id', 'room_players.room_id')
            .where('rooms.status', RoomStatusEnum.ACTIVE)
            .andWhere('rooms.token', token)
            .andWhere((query): void => {
                query.where('room_players.user_id', user.id);
            })
            .preload('owner')
            .preload('players', (playersQuery): void => {
                playersQuery
                    .preload('user', (userQuery): void => {
                        userQuery.preload('profilePicture');
                    })
                    .preload('bot', (botQuery): void => {
                        botQuery.preload('picture');
                    })
                    .preload('country')
                    .orderBy('frontId');
            })
            .first();
    }

    public async getPaginatedForHeartbeatChecks(page: number) {
        return this.Model.query()
            .where('rooms.status', RoomStatusEnum.ACTIVE)
            .preload('players', (playersQuery): void => {
                playersQuery.andWhereNotNull('user_id').preload('user');
            })
            .paginate(page, 50);
    }
}
