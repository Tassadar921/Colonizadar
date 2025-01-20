import vine from '@vinejs/vine';

export const getPendingFriendsValidator = vine.compile(
    vine.object({
        query: vine.string().trim().optional(),
        page: vine.number().positive().optional(),
        perPage: vine.number().positive().optional(),
    })
);

export const addPendingFriendsValidator = vine.compile(
    vine.object({
        userId: vine.number().positive(),
    })
);
