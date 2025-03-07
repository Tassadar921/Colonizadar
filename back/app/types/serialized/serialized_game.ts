import SerializedRoomPlayer from '#types/serialized/serialized_room_player';
import SerializedGameTerritory from '#types/serialized/serialized_game_territory';

type SerializedGame = {
    id: number;
    players: SerializedRoomPlayer[];
    territories: SerializedGameTerritory[];
    createdAt?: string;
    updatedAt?: string;
};

export default SerializedGame;
