import vine from '@vinejs/vine';
import RoomPlayerDifficultyEnum from '#types/enum/room_player_difficulty_enum';

export const roomMiddlewareValidator = vine.compile(
    vine.object({
        roomId: vine.number().positive().optional(),
        token: vine.string().uuid().optional(),
    })
);

export const createRoomValidator = vine.compile(
    vine.object({
        name: vine.string().minLength(3).maxLength(50).alphaNumeric(),
        password: vine.string().optional(),
    })
);

export const inviteRoomValidator = vine.compile(
    vine.object({
        userId: vine.number().positive(),
    })
);

export const addBotValidator = vine.compile(
    vine.object({
        difficulty: vine.number().positive().max(Object.values(RoomPlayerDifficultyEnum).length),
    })
);

export const kickValidator = vine.compile(
    vine.object({
        playerId: vine.number().positive(),
    })
);
