import SerializedUser from '#types/serialized/serialized_user';
import RoomPeopleDifficultyEnum from '#types/enum/room_player_difficulty_enum';
import SerializedBot from '#types/serialized/serialized_bot';
import SerializedPlayableCountry from '#types/serialized/serialized_playable_country';

type SerializedRoomPlayer = {
    id: number;
    user?: SerializedUser;
    bot?: SerializedBot;
    country: SerializedPlayableCountry;
    isUserConnected: boolean;
    difficulty: RoomPeopleDifficultyEnum;
    createdAt?: string;
    updatedAt?: string;
};

export default SerializedRoomPlayer;
