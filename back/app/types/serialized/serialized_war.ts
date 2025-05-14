import SerializedRoomPlayer from '#types/serialized/serialized_room_player';
import WarStatusEnum from '#types/enum/war_status_enum';

type SerializedWar = {
    id: number;
    status: WarStatusEnum;
    startSeason: number;
    startYear: number;
    endSeason?: number;
    endYear?: number;
    enemy: SerializedRoomPlayer;
    createdAt?: string;
    updatedAt?: string;
};

export default SerializedWar;
