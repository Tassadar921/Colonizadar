import SerializedRoomPlayer from '#types/serialized/serialized_room_player';
import SerializedGameTerritory from '#types/serialized/serialized_game_territory';
import SerializedUser from '#types/serialized/serialized_user';

type SerializedGame = {
    id: number;
    name: string;
    season: number;
    year: number;
    owner: SerializedUser;
    players: SerializedRoomPlayer[];
    territories: SerializedGameTerritory[];
    createdAt?: string;
    updatedAt?: string;
};

export default SerializedGame;
