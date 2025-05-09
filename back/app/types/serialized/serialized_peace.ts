import SerializedRoomPlayer from '#types/serialized/serialized_room_player';

type SerializedPeace = {
    id: number;
    expirationSeason: number;
    expirationYear: number;
    enemy: SerializedRoomPlayer;
    createdAt?: string;
    updatedAt?: string;
};

export default SerializedPeace;
