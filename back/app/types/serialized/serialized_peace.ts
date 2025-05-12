import SerializedRoomPlayer from '#types/serialized/serialized_room_player';
import PeaceStatusEnum from '#types/enum/peace_status_enum';

type SerializedPeace = {
    id: number;
    status: PeaceStatusEnum;
    expirationSeason: number;
    expirationYear: number;
    enemy: SerializedRoomPlayer;
    createdAt?: string;
    updatedAt?: string;
};

export default SerializedPeace;
