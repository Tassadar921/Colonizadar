import vine from '@vinejs/vine';

export const getBlockedUsersValidator = vine.compile(
    vine.object({
        query: vine.string().trim().optional(),
        page: vine.number().positive().optional(),
        perPage: vine.number().positive().optional()
    })
);
