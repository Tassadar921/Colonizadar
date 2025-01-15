import vine from '@vinejs/vine';

export const loginValidator = vine.compile(
    vine.object({
        email: vine.string().trim().email(),
        password: vine.string().trim(),
    })
);

export const sendAccountCreationEmailValidator = vine.compile(
    vine.object({
        username: vine.string().trim().minLength(3).maxLength(50).alphaNumeric(),
        email: vine.string().trim().email(),
        password: vine.string().trim().confirmed({ confirmationField: 'confirmPassword' }),
        frontClient: vine.string().trim(),
        frontUri: vine.string().trim().url(),
        consent: vine.boolean(),
    })
);
