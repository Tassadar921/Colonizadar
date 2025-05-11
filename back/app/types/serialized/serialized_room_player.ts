import SerializedUser from '#types/serialized/serialized_user';
import SerializedBot from '#types/serialized/serialized_bot';
import SerializedPlayableCountry from '#types/serialized/serialized_playable_country';
import SerializedBotDifficulty from '#types/serialized/serialized_bot_difficulty';
import SerializedPeace from '#types/serialized/serialized_peace';

type SerializedRoomPlayer = {
    id: number;
    score: number;
    user?: SerializedUser;
    bot?: SerializedBot;
    country: SerializedPlayableCountry;
    isUserConnected: boolean;
    isReady: boolean;
    gold?: number;
    wars?: SerializedRoomPlayer[];
    peaces?: SerializedPeace[];
    pendingPeaces?: SerializedRoomPlayer[];
    difficulty: SerializedBotDifficulty;
    createdAt?: string;
    updatedAt?: string;
};

export default SerializedRoomPlayer;
