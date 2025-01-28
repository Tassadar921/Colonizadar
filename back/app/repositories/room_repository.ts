import BaseRepository from '#repositories/base/base_repository';
import Room from '#models/room';
import User from '#models/user';
import RoomStatusEnum from '#types/enum/room_status_enum';

export default class RoomRepository extends BaseRepository<typeof Room> {
    constructor() {
        super(Room);
    }

    public async getFromUserAndFrontId(user: User, roomId: number): Promise<Room | null> {
        return Room.query()
            .select('rooms.*')
            .leftJoin('room_players', 'rooms.id', 'room_players.room_id')
            .where('rooms.status', RoomStatusEnum.ACTIVE)
            .andWhere('rooms.front_id', roomId)
            .andWhere((query): void => {
                query.where('rooms.owner_id', user.id).orWhere('room_players.user_id', user.id);
            })
            .preload('owner')
            .preload('players', (playersQuery): void => {
                playersQuery.preload('user', (userQuery): void => {
                    userQuery.preload('profilePicture');
                });
            })
            .first();
    }
}
