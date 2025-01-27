import SerializedUser from "#types/serialized/serialized_user";
import RoomPeopleDifficultyEnum from "#types/enum/room_player_difficulty_enum";

type SerializedRoomPlayer = {
    id: number;
    user?: SerializedUser;
    isUserConnected: boolean;
    difficulty: RoomPeopleDifficultyEnum;
    createdAt?: string;
    updatedAt?: string;
};

export default SerializedRoomPlayer;
