import SerializedRoomPlayer from '#types/serialized/serialized_room_player';

type SerializedPendingPeace = {
    id: number;
    enemy: SerializedRoomPlayer;
    createdAt?: string;
    updatedAt?: string;
};

export default SerializedPendingPeace;
