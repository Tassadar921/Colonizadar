import vine from '@vinejs/vine';

export const loginValidator = vine.compile(
    vine.object({
        email: vine.string().trim().email(),
        password: vine.string().trim(),
    })
);

export const joinRoomValidator = vine.compile(
    vine.object({
        token: vine.string().uuid(),
    })
);
