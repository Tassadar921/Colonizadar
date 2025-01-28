import RoomStatusEnum from '#types/enum/room_status_enum';
import SerializedUser from '#types/serialized/serialized_user';
import SerializedRoomPlayer from '#types/serialized/serialized_room_player';

type SerializedRoom = {
    id: number;
    name: string;
    public: boolean;
    token: string;
    status: RoomStatusEnum;
    owner: SerializedUser;
    players: SerializedRoomPlayer[];
    createdAt?: string;
    updatedAt?: string;
};

export default SerializedRoom;
