import SerializedRoomPlayer from '#types/serialized/serialized_room_player';
import SerializedGameTerritory from '#types/serialized/serialized_game_territory';
import SerializedUser from '#types/serialized/serialized_user';
import SerializedMapLight from '#types/serialized/serialized_map_light';

type SerializedGame = {
    id: number;
    name: string;
    season: number;
    year: number;
    map: SerializedMapLight;
    owner: SerializedUser;
    players: SerializedRoomPlayer[];
    territories: SerializedGameTerritory[];
    createdAt?: string;
    updatedAt?: string;
};

export default SerializedGame;
