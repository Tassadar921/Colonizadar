import SerializedRoomPlayer from '#types/serialized/serialized_room_player';
import PeaceStatusEnum from '#types/enum/peace_status_enum';
import SerializedWar from '#types/serialized/serialized_war';

type SerializedPeace = {
    id: number;
    status: PeaceStatusEnum;
    expirationSeason: number;
    expirationYear: number;
    enemy: SerializedRoomPlayer;
    war: SerializedWar;
    createdAt?: string;
    updatedAt?: string;
};

export default SerializedPeace;
