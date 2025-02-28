import SerializedRoomPlayer from '#types/serialized/serialized_room_player';

type SerializedGame = {
    id: number;
    players: SerializedRoomPlayer[];
    createdAt?: string;
    updatedAt?: string;
};

export default SerializedGame;
