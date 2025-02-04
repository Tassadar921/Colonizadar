import BaseRepository from '#repositories/base/base_repository';
import Room from '#models/room';
import User from '#models/user';
import RoomStatusEnum from '#types/enum/room_status_enum';

export default class RoomRepository extends BaseRepository<typeof Room> {
    constructor() {
        super(Room);
    }

    public async getFromFrontId(roomId: number): Promise<Room | null> {
        return Room.query()
            .where('status', RoomStatusEnum.ACTIVE)
            .andWhere('front_id', roomId)
            .preload('owner')
            .preload('players', (playersQuery): void => {
                playersQuery
                    .preload('user', (userQuery): void => {
                        userQuery.preload('profilePicture');
                    })
                    .preload('botName')
                    .orderBy('frontId');
            })
            .first();
    }

    public async getFromUserAndToken(user: User, token: string): Promise<Room | null> {
        return Room.query()
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
                    .preload('botName')
                    .orderBy('frontId');
            })
            .first();
    }

    public async getPaginatedForHeartbeatChecks(page: number) {
        return Room.query()
            .where('rooms.status', RoomStatusEnum.ACTIVE)
            .preload('players', (playersQuery): void => {
                playersQuery.andWhereNotNull('user_id').preload('user');
            })
            .paginate(page, 50);
    }

    public async getDistinctBotNamesFromRoom(room: Room): Promise<string[]> {
        const rooms: Room[] = await Room.query()
            .select('room_players.bot_name_id')
            .where('rooms.id', room.id)
            .leftJoin('room_players', 'rooms.id', 'room_players.room_id')
            .distinct('room_players.bot_name_id')
            .andWhereNull('room_players.user_id')
            .andWhereNotNull('room_players.bot_name_id');

        return <string[]>rooms[0]?.$extras.bot_name_ids ?? [];
    }
}
