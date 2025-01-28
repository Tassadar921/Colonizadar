import vine from '@vinejs/vine';

export const createRoomValidator = vine.compile(
    vine.object({
        name: vine.string().minLength(3).maxLength(50).alphaNumeric(),
        password: vine.string().optional(),
    })
);

export const joinRoomValidator = vine.compile(
    vine.object({
        token: vine.string().uuid(),
    })
);

export const getRoomValidator = vine.compile(
    vine.object({
        roomId: vine.number().positive(),
    })
);

export const inviteRoomValidator = vine.compile(
    vine.object({
        userId: vine.number().positive(),
    })
);
