import BaseRepository from '#repositories/base/base_repository';
import Room from '#models/room';
import RoomStatusEnum from '#types/enum/room_status_enum';
import hash from '@adonisjs/core/services/hash';

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
                playersQuery.orderBy('frontId');
            })
            .preload('map', (mapQuery): void => {
                mapQuery
                    .preload('territories', (territoriesQuery): void => {
                        territoriesQuery.preload('neighbours', (neighboursQuery): void => {
                            neighboursQuery.preload('neighbour');
                        });
                    })
                    .preload('createdBy');
            })
            .first();
    }

    public async getFromUserAndToken(token: string, password?: string): Promise<Room | null> {
        const room: Room | null = await this.Model.query()
            .select('rooms.*')
            .whereIn('rooms.status', [RoomStatusEnum.OPENED, RoomStatusEnum.STARTING])
            .andWhere('rooms.token', token)
            .preload('owner')
            .preload('players', (playersQuery): void => {
                playersQuery.orderBy('frontId');
            })
            .preload('map', (mapQuery): void => {
                mapQuery
                    .preload('territories', (territoriesQuery): void => {
                        territoriesQuery.preload('neighbours', (neighboursQuery): void => {
                            neighboursQuery.preload('neighbour');
                        });
                    })
                    .preload('createdBy');
            })
            .first();

        if (!room || (!room.public && !password)) {
            return null;
        }

        if (!room.public) {
            const isValidPassword: boolean = await hash.verify(<string>room.password, <string>password);
            if (!isValidPassword) {
                return null;
            }
        }

        return room;
    }

    public async getPaginatedForRoomHeartbeatChecks(page: number) {
        return this.Model.query()
            .where('rooms.status', RoomStatusEnum.OPENED)
            .preload('players', (playersQuery): void => {
                playersQuery.andWhereNotNull('user_id');
            })
            .paginate(page, 50);
    }
}
