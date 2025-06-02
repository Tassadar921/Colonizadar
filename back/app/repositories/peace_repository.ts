import BaseRepository from '#repositories/base/base_repository';
import Peace from '#models/peace';
import RoomPlayer from '#models/room_player';
import PeaceStatusEnum from '#types/enum/peace_status_enum';

export default class PeaceRepository extends BaseRepository<typeof Peace> {
    constructor() {
        super(Peace);
    }

    public async loadFromGamePlayer(player: RoomPlayer): Promise<void> {
        await player.load('peaces', (peacesQuery): void => {
            peacesQuery
                .preload('enemy')
                .preload('war', (warQuery): void => {
                    warQuery.preload('enemy');
                })
                .where('status', PeaceStatusEnum.IN_PROGRESS);
        });
    }
}
