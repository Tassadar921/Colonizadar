import SerializedUser from '#types/serialized/serialized_user';
import SerializedBot from '#types/serialized/serialized_bot';
import SerializedPlayableCountry from '#types/serialized/serialized_playable_country';
import SerializedBotDifficulty from '#types/serialized/serialized_bot_difficulty';
import SerializedPeace from '#types/serialized/serialized_peace';
import SerializedWar from '#types/serialized/serialized_war';

type SerializedRoomPlayer = {
    id: number;
    score: number;
    user?: SerializedUser;
    bot?: SerializedBot;
    country: SerializedPlayableCountry;
    isUserConnected: boolean;
    isReady: boolean;
    gold?: number;
    wars?: SerializedWar[];
    peaces?: SerializedPeace[];
    receivedPendingPeaces?: SerializedRoomPlayer[];
    sentPendingPeaces?: SerializedRoomPlayer[];
    difficulty: SerializedBotDifficulty;
    createdAt?: string;
    updatedAt?: string;
};

export default SerializedRoomPlayer;
