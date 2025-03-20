import BaseRepository from '#repositories/base/base_repository';
import Room from '#models/room';
import RoomStatusEnum from '#types/enum/room_status_enum';

export default class RoomRepository extends BaseRepository<typeof Room> {
    constructor() {
        super(Room);
    }

    public async getFromFrontId(roomId: number): Promise<Room | null> {
        return this.Model.query()
            .where('status', RoomStatusEnum.OPENED)
            .orWhere('rooms.status', RoomStatusEnum.STARTING)
            .andWhere('front_id', roomId)
            .preload('owner')
            .preload('players', (playersQuery): void => {
                playersQuery
                    .preload('user')
                    .preload('bot')
                    .preload('country')
                    .preload('difficulty')
                    .orderBy('frontId');
            })
            .preload('map', (mapQuery): void => {
                mapQuery.preload('territories').preload('createdBy');
            })
            .first();
    }

    public async getFromUserAndToken(token: string): Promise<Room | null> {
        return this.Model.query()
            .select('rooms.*')
            .where('rooms.status', RoomStatusEnum.OPENED)
            .orWhere('rooms.status', RoomStatusEnum.STARTING)
            .andWhere('rooms.token', token)
            .preload('owner')
            .preload('players', (playersQuery): void => {
                playersQuery
                    .preload('user')
                    .preload('bot')
                    .preload('country')
                    .preload('difficulty')
                    .orderBy('frontId');
            })
            .preload('map', (mapQuery): void => {
                mapQuery.preload('territories').preload('createdBy');
            })
            .first();
    }

    public async getPaginatedForHeartbeatChecks(page: number) {
        return this.Model.query()
            .where('rooms.status', RoomStatusEnum.OPENED)
            .preload('players', (playersQuery): void => {
                playersQuery.andWhereNotNull('user_id').preload('user');
            })
            .paginate(page, 50);
    }
}
