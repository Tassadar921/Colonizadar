import SerializedRoomPlayer from '#types/serialized/serialized_room_player';
import SerializedTerritory from '#types/serialized/serialized_territory';

type SerializedGameTerritory = {
    id: number;
    power?: number;
    ships?: number;
    owner?: SerializedRoomPlayer;
    territory: SerializedTerritory;
    createdAt?: string;
    updatedAt?: string;
};

export default SerializedGameTerritory;
