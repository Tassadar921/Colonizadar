import vine from '@vinejs/vine';

export const createCheckoutSessionValidator = vine.compile(
    vine.object({
        frontUri: vine.string().trim().url(),
    })
);
